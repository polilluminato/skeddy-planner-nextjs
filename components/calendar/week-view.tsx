import { weekDays } from "@/lib/domain/dates";
import { formatLongDay } from "@/lib/domain/format";
import { DaySection, type DayListProps } from "./day-list";
import type { CalendarShift } from "./types";

export function WeekView({
  date,
  today,
  byDate,
  ...rest
}: Omit<DayListProps, "shifts"> & { date: string; today: string; byDate: Map<string, CalendarShift[]> }) {
  return (
    <div className="grid gap-3">
      {weekDays(date).map((day) => (
        <DaySection
          key={day}
          date={day}
          title={formatLongDay(day)}
          isToday={day === today}
          shifts={byDate.get(day) ?? []}
          {...rest}
        />
      ))}
    </div>
  );
}
