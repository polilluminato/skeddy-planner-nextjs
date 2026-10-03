"use client";

import Link from "next/link";
import { MemberChip } from "@/components/common/member-chip";
import { calendarHref } from "@/lib/domain/calendar";
import { dayOfMonth, formatLongDay, formatShortWeekday } from "@/lib/domain/format";
import { groupByDate } from "@/lib/domain/schedule";
import { shiftMinutes } from "@/lib/domain/shifts";
import {
  horizontalPosition,
  layoutOverlaps,
  minuteOffset,
  minutesToTime,
  slotRange,
  verticalPosition,
  type HourRange,
} from "@/lib/domain/time-grid";
import { cn } from "@/lib/utils";
import { useShiftEditor } from "./shift-editor";
import { memberName, tint, type CalendarMember, type CalendarShift } from "./types";

/** Altezza di un'ora nella griglia. */
const HOUR_REM = 3.5;

type Props = {
  days: string[];
  today: string;
  hours: HourRange;
  shifts: CalendarShift[];
  members: CalendarMember[];
  currentUserId: string;
  canEdit: boolean;
  /** Minuti trascorsi da mezzanotte nel fuso dell'app, per la linea "adesso". */
  nowMinutes: number;
  extraParams?: string;
};

/**
 * Vista a griglia oraria (giorno o settimana) in stile Google Calendar: un turno è un
 * blocco alto quanto la sua durata; un clic su uno slot libero propone un nuovo turno.
 */
export function TimeGrid({
  days,
  today,
  hours,
  shifts,
  members,
  currentUserId,
  canEdit,
  nowMinutes,
  extraParams = "",
}: Props) {
  const editor = useShiftEditor();
  const memberById = new Map(members.map((m) => [m.id, m]));
  const byDate = groupByDate(shifts);
  const hourList = Array.from({ length: hours.to - hours.from }, (_, i) => hours.from + i);
  const columns = { gridTemplateColumns: `4rem repeat(${days.length}, minmax(0, 1fr))` };
  const single = days.length === 1;

  function addAt(date: string, e: React.MouseEvent<HTMLDivElement>) {
    if (!canEdit || !editor || e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const hour = hours.from + Math.floor(((e.clientY - rect.top) / rect.height) * (hours.to - hours.from));
    editor.open({ date, ...slotRange(hour) });
  }

  return (
    <section aria-label={single ? "Turni del giorno" : "Turni della settimana"} className="rounded-xl border bg-card">
      <div
        className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 grid rounded-t-xl border-b bg-card"
        style={columns}
      >
        <span aria-hidden />
        {days.map((day) => {
          const isToday = day === today;
          const label = (
            <>
              <span className={cn("text-xs font-medium uppercase", isToday ? "text-primary" : "text-muted-foreground")}>
                {formatShortWeekday(day)}
              </span>
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full text-lg font-semibold tabular-nums",
                  isToday && "bg-primary text-primary-foreground",
                )}
              >
                {dayOfMonth(day)}
              </span>
            </>
          );
          return single ? (
            <div key={day} className="flex items-center gap-2 border-l px-3 py-2">
              {label}
            </div>
          ) : (
            <Link
              key={day}
              href={calendarHref({ view: "day", date: day }) + extraParams}
              aria-label={`${formatLongDay(day)}, vista giorno`}
              aria-current={isToday ? "date" : undefined}
              className="flex flex-col items-center gap-0.5 border-l py-2 transition-colors hover:bg-accent"
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="grid" style={columns}>
        <div aria-hidden className="relative">
          {hourList.map((hour, i) => (
            <span
              key={hour}
              className="absolute right-2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums"
              style={{ top: `${i * HOUR_REM}rem` }}
            >
              {i > 0 && minutesToTime(hour * 60)}
            </span>
          ))}
        </div>

        {days.map((day) => {
          const placed = layoutOverlaps(byDate.get(day) ?? []);
          const now = day === today ? minuteOffset(nowMinutes, hours) : null;
          return (
            <div
              key={day}
              role="group"
              aria-label={formatLongDay(day)}
              onClick={(e) => addAt(day, e)}
              className={cn("relative border-l", canEdit && editor && "cursor-pointer")}
              style={{
                height: `${hourList.length * HOUR_REM}rem`,
                // Una riga per ora, disegnata come sfondo: non intercetta i clic.
                backgroundImage: "linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: `100% ${HOUR_REM}rem`,
              }}
            >
              <ul>
                {placed.map(({ item: shift, column, columns: count }) => {
                  const member = memberById.get(shift.userId);
                  if (!member) return null;
                  const { top, height } = verticalPosition(shift, hours);
                  const { left, width } = horizontalPosition(column, count);
                  return (
                    <li
                      key={shift.id}
                      className="absolute px-0.5 hover:z-10 focus-within:z-10"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    >
                      <GridShift
                        shift={shift}
                        member={member}
                        isMine={shift.userId === currentUserId}
                        onEdit={canEdit && editor ? () => editor.open({ shift, date: shift.date }) : undefined}
                      />
                    </li>
                  );
                })}
              </ul>
              {now !== null && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 z-20" style={{ top: `${now}%` }}>
                  <span className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-primary" />
                  <span className="block h-0.5 bg-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GridShift({
  shift,
  member,
  isMine,
  onEdit,
}: {
  shift: CalendarShift;
  member: CalendarMember;
  isMine: boolean;
  onEdit?: () => void;
}) {
  const name = memberName(member);
  const time = `${shift.start}–${shift.end}`;
  // Sotto l'ora il blocco è basso: nome e orario su una riga sola.
  const compact = shiftMinutes(shift) < 60;
  const className = cn(
    "flex h-full w-full min-w-0 overflow-hidden rounded-md border border-l-4 border-card px-2 py-1 text-left text-xs shadow-xs",
    compact ? "items-center gap-1.5" : "flex-col",
    isMine && "ring-2 ring-primary/40",
  );
  const style = { borderLeftColor: member.color, background: tint(member.color, 22) };
  const content = (
    <>
      <span className="flex min-w-0 shrink">
        <MemberChip name={name} color={member.color} />
      </span>
      <span className="truncate text-muted-foreground tabular-nums">{time}</span>
      {!compact && shift.note && <span className="truncate text-muted-foreground">{shift.note}</span>}
    </>
  );

  if (!onEdit) {
    return (
      <div className={className} style={style} title={`${name}, ${time}`}>
        {content}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={cn(className, "transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-ring")}
      style={style}
      onClick={onEdit}
      aria-label={`Modifica turno di ${name}, ${time}`}
      title={shift.note ? `${name}, ${time} · ${shift.note}` : `${name}, ${time}`}
    >
      {content}
    </button>
  );
}
