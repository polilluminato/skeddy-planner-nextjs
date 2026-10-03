import type { ReactNode } from "react";
import Link from "next/link";
import { MemberChip } from "@/components/common/member-chip";
import type { HoursRow } from "@/lib/domain/schedule";
import { formatMinutes } from "@/lib/domain/shifts";
import { HoursBar, HoursStatusText } from "./hours-summary";
import { memberName, type CalendarMember } from "./types";

/** Una card per persona con le ore assegnate nella settimana rispetto alle previste. */
export function TeamHours({
  rows,
  members,
  title,
  actions,
  className,
}: {
  rows: HoursRow[];
  members: Map<string, CalendarMember>;
  title: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby="team-hours-title" className={className}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 id="team-hours-title" className="text-sm font-medium text-muted-foreground">
          {title}
        </h2>
        {actions}
      </div>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
        {rows.map((row) => {
          const member = members.get(row.userId);
          if (!member) return null;
          return (
            <li key={row.userId} className="w-60 shrink-0 snap-start">
              <Link
                href={`/team/${member.id}`}
                className="grid h-full gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/60"
              >
                <span className="flex min-w-0">
                  <MemberChip name={memberName(member)} color={member.color} />
                </span>
                <span className="flex items-baseline gap-1 tabular-nums">
                  <span className="text-2xl font-semibold tracking-tight">{formatMinutes(row.planned)}</span>
                  <span className="text-muted-foreground">
                    / {row.target > 0 ? formatMinutes(row.target) : "–"}
                  </span>
                </span>
                <HoursBar row={row} color={member.color} />
                <HoursStatusText row={row} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
