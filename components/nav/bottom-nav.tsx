"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDaysIcon, UserRoundIcon, UsersRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/calendar", label: "Calendario", icon: CalendarDaysIcon, adminOnly: false },
  { href: "/team", label: "Team", icon: UsersRoundIcon, adminOnly: true },
  { href: "/profile", label: "Profilo", icon: UserRoundIcon, adminOnly: false },
];

export function BottomNav({ isAdmin }: { isAdmin: boolean }) {
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
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
