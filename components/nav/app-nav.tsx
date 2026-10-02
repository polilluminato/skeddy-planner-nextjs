"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  MessagesSquareIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { SIDEBAR_COOKIE } from "@/config/app";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/calendar", label: "Calendario", icon: CalendarDaysIcon, adminOnly: false },
  { href: "/messages", label: "Messaggi", icon: MessagesSquareIcon, adminOnly: false },
  { href: "/team", label: "Team", icon: UsersRoundIcon, adminOnly: true },
  { href: "/profile", label: "Profilo", icon: UserRoundIcon, adminOnly: false },
];

/**
 * Navigazione principale: bottom nav su mobile; per gli admin, da desktop,
 * diventa una sidebar a sinistra (variante `desktop:`, vedi `app/globals.css`),
 * comprimibile a sole icone. Lo stato sta in un cookie, letto dal layout al render.
 */
export function AppNav({
  isAdmin,
  unread,
  defaultCollapsed,
}: {
  isAdmin: boolean;
  unread: number;
  defaultCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const items = ITEMS.filter((item) => isAdmin || !item.adminOnly);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : ""}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <nav
      aria-label="Navigazione principale"
      // Il layout legge questo attributo con `:has()` per stringere il padding a sinistra.
      data-sidebar-collapsed={collapsed ? "" : undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "desktop:inset-y-0 desktop:right-auto desktop:border-t-0 desktop:border-r desktop:pt-[env(safe-area-inset-top)] desktop:pb-4",
        collapsed ? "desktop:w-16" : "desktop:w-60",
      )}
    >
      <div className={cn("hidden h-14 items-center desktop:flex", collapsed ? "justify-center" : "justify-between pr-2 pl-5")}>
        {!collapsed && (
          <Link href="/calendar">
            <Logo />
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Espandi barra laterale" : "Comprimi barra laterale"}
          title={collapsed ? "Espandi barra laterale" : "Comprimi barra laterale"}
          className="grid size-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpenIcon className="size-5" aria-hidden /> : <PanelLeftCloseIcon className="size-5" aria-hidden />}
        </button>
      </div>
      <ul className={cn("mx-auto flex max-w-2xl desktop:mx-0 desktop:mt-2 desktop:max-w-none desktop:flex-col desktop:gap-1", collapsed ? "desktop:px-2" : "desktop:px-3")}>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          // Sulla pagina dei messaggi li si sta leggendo: niente badge.
          const badge = href === "/messages" && !active && unread > 0 ? unread : 0;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={badge ? `${label}, ${badge} non ${badge === 1 ? "letto" : "letti"}` : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors",
                  "desktop:min-h-11 desktop:flex-row desktop:gap-3 desktop:rounded-lg desktop:px-3 desktop:text-sm",
                  !collapsed && "desktop:justify-start",
                  active
                    ? "text-primary desktop:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground desktop:hover:bg-accent",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden strokeWidth={active ? 2.4 : 2} />
                  {badge > 0 && (
                    <span
                      className="absolute -top-1.5 left-3 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] leading-none font-semibold text-primary-foreground tabular-nums ring-2 ring-background"
                      aria-hidden
                    >
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </span>
                <span className={cn(collapsed && "desktop:sr-only")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
