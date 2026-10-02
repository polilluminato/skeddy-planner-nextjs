import Link from "next/link";
import { calendarHref } from "@/lib/domain/calendar";
import { isSameMonth, monthGrid } from "@/lib/domain/dates";
import { dayOfMonth, formatLongDay, weekdayLabels } from "@/lib/domain/format";
import { cn } from "@/lib/utils";
import type { CalendarMember, CalendarShift } from "./types";

const MAX_DOTS = 4;

export function MonthView({
  date,
  today,
  byDate,
  members,
  extraParams = "",
}: {
  date: string;
  today: string;
  byDate: Map<string, CalendarShift[]>;
  members: Map<string, CalendarMember>;
  extraParams?: string;
}) {
  const weeks = monthGrid(date);
  return (
    <div className="rounded-xl border bg-card p-2">
      <div className="grid grid-cols-7 pb-1" aria-hidden>
        {weekdayLabels().map((label) => (
          <span key={label} className="py-1 text-center text-xs font-medium text-muted-foreground uppercase">
            {label}
          </span>
        ))}
      </div>
      <ul className="grid grid-cols-7 gap-1" aria-label="Giorni del mese">
        {weeks.flat().map((day) => {
          const shifts = byDate.get(day) ?? [];
          const inMonth = isSameMonth(day, date);
          const isToday = day === today;
          const label = `${formatLongDay(day)}: ${shifts.length === 0 ? "nessun turno" : shifts.length === 1 ? "1 turno" : `${shifts.length} turni`}`;
          return (
            <li key={day}>
              <Link
                href={calendarHref({ view: "day", date: day }) + extraParams}
                aria-label={label}
                aria-current={isToday ? "date" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center gap-1 rounded-lg py-1.5 transition-colors hover:bg-accent desktop:min-h-24",
                  !inMonth && "opacity-45",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-sm tabular-nums",
                    isToday && "bg-primary font-semibold text-primary-foreground",
                  )}
                >
                  {dayOfMonth(day)}
                </span>
                <span className="flex flex-wrap justify-center gap-0.5" aria-hidden>
                  {shifts.slice(0, MAX_DOTS).map((s) => (
                    <span
                      key={s.id}
                      className="size-1.5 rounded-full"
                      style={{ background: members.get(s.userId)?.color ?? "currentColor" }}
                    />
                  ))}
                  {shifts.length > MAX_DOTS && (
                    <span className="text-[0.625rem] leading-none text-muted-foreground">+{shifts.length - MAX_DOTS}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
