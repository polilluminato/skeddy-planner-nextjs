import { MemberChip } from "@/components/common/member-chip";
import { formatMinutes, type WeeklyStatus } from "@/lib/domain/shifts";
import type { HoursRow } from "@/lib/domain/schedule";
import { cn } from "@/lib/utils";
import { memberName, type CalendarMember } from "./types";

const STATUS: Record<WeeklyStatus, { label: string; className: string }> = {
  unset: { label: "Ore non impostate", className: "text-muted-foreground" },
  under: { label: "Sotto le ore previste", className: "text-warning" },
  ok: { label: "In linea", className: "text-success" },
  over: { label: "Oltre le ore previste", className: "text-destructive" },
};

export function HoursStatusText({ row }: { row: HoursRow }) {
  const status = STATUS[row.status];
  const diff = row.planned - row.target;
  return (
    <span className={cn("text-xs font-medium", status.className)}>
      {status.label}
      {(row.status === "under" || row.status === "over") && ` (${diff > 0 ? "+" : ""}${formatMinutes(diff)})`}
    </span>
  );
}

export function HoursBar({ row, color }: { row: HoursRow; color: string }) {
  if (row.target <= 0) return null;
  const pct = Math.min(100, Math.round((row.planned / row.target) * 100));
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={row.target}
      aria-valuenow={Math.min(row.planned, row.target)}
      aria-label="Ore pianificate rispetto alle previste"
    >
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function HoursSummary({
  rows,
  members,
  title = "Ore della settimana",
}: {
  rows: HoursRow[];
  members: Map<string, CalendarMember>;
  title?: string;
}) {
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="hours-title" className="rounded-xl border bg-card p-4">
      <h2 id="hours-title" className="mb-3 font-semibold">
        {title}
      </h2>
      <ul className="grid gap-3 desktop:grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))] desktop:gap-x-8">
        {rows.map((row) => {
          const member = members.get(row.userId);
          if (!member) return null;
          return (
            <li key={row.userId} className="grid gap-1.5">
              <div className="flex items-center gap-2">
                <span className="flex min-w-0 flex-1 text-sm">
                  <MemberChip name={memberName(member)} color={member.color} />
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatMinutes(row.planned)}
                  {row.target > 0 && (
                    <span className="font-normal text-muted-foreground"> / {formatMinutes(row.target)}</span>
                  )}
                </span>
              </div>
              <HoursBar row={row} color={member.color} />
              <HoursStatusText row={row} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
