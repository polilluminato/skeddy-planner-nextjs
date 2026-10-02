import Link from "next/link";
import type { HoursRow } from "@/lib/domain/schedule";
import { formatMinutes } from "@/lib/domain/shifts";
import { HoursBar, HoursStatusText } from "./hours-summary";
import { memberName, type CalendarMember } from "./types";

/** Una card per persona con le ore assegnate nella settimana rispetto alle previste. */
export function TeamHours({
  rows,
  members,
  title,
  className,
}: {
  rows: HoursRow[];
  members: Map<string, CalendarMember>;
  title: string;
  className?: string;
}) {
  return (
    <section aria-labelledby="team-hours-title" className={className}>
      <h2 id="team-hours-title" className="mb-3 text-sm font-medium text-muted-foreground">
        {title}
      </h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
        {rows.map((row) => {
          const member = members.get(row.userId);
          if (!member) return null;
          return (
            <li key={row.userId}>
              <Link
                href={`/team/${member.id}`}
                className="grid h-full gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/60"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: member.color }} aria-hidden />
                  <span className="truncate font-medium">{memberName(member)}</span>
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
