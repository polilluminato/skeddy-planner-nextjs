"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, CalendarDaysIcon, UserRoundIcon, UsersRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/calendar", label: "Calendario", icon: CalendarDaysIcon, adminOnly: false },
  { href: "/messages", label: "Notifiche", icon: BellIcon, adminOnly: false },
  { href: "/team", label: "Team", icon: UsersRoundIcon, adminOnly: true },
  { href: "/profile", label: "Profilo", icon: UserRoundIcon, adminOnly: false },
];

export function BottomNav({ isAdmin, unread }: { isAdmin: boolean; unread: number }) {
  const pathname = usePathname();
  const items = ITEMS.filter((item) => isAdmin || !item.adminOnly);

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <ul className="mx-auto flex max-w-2xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          // Sulla pagina delle notifiche i messaggi si stanno leggendo: niente badge.
          const badge = href === "/messages" && !active && unread > 0 ? unread : 0;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={badge ? `${label}, ${badge} non ${badge === 1 ? "letta" : "lette"}` : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
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
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
