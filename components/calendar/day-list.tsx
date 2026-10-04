import { AddShiftButton } from "./add-shift-button";
import { ShiftCard } from "./shift-card";
import type { CalendarMember, CalendarShift } from "./types";

export type DayListProps = {
  shifts: CalendarShift[];
  members: Map<string, CalendarMember>;
  /** null per l'Amministrazione, che non ha turni */
  currentUserId: string | null;
  canEdit: boolean;
};

export function ShiftList({ shifts, members, currentUserId, canEdit }: DayListProps) {
  if (shifts.length === 0) {
    return <p className="py-1 text-sm text-muted-foreground">Nessun turno</p>;
  }
  return (
    <ul className="grid gap-2 desktop:grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]">
      {shifts.map((shift) => {
        const member = members.get(shift.userId);
        if (!member) return null;
        return (
          <li key={shift.id}>
            <ShiftCard shift={shift} member={member} isMine={shift.userId === currentUserId} canEdit={canEdit} />
          </li>
        );
      })}
    </ul>
  );
}

export function DaySection({
  date,
  title,
  isToday,
  defaultUserId,
  ...list
}: DayListProps & { date: string; title: string; isToday: boolean; defaultUserId?: string }) {
  const headingId = `day-${date}`;
  return (
    <section
      aria-labelledby={headingId}
      className={isToday ? "rounded-xl border border-primary/40 bg-primary/5 p-3" : "rounded-xl border bg-card p-3"}
    >
      <div className="mb-2 flex items-center gap-2">
        <h3 id={headingId} className="flex-1 font-semibold">
          {title}
          {isToday && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              Oggi
            </span>
          )}
        </h3>
        {list.canEdit && <AddShiftButton date={date} userId={defaultUserId} />}
      </div>
      <ShiftList {...list} />
    </section>
  );
}
