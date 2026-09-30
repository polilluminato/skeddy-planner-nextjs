import { shiftMinutes, sortByStart, weeklyStatus, type TimeRange, type WeeklyStatus } from "./shifts";

type DatedShift = TimeRange & { date: string; userId: string };

export function groupByDate<T extends DatedShift>(shifts: readonly T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const s of shifts) {
    const list = map.get(s.date) ?? [];
    list.push(s);
    map.set(s.date, list);
  }
  for (const [date, list] of map) map.set(date, sortByStart(list));
  return map;
}

export function minutesByUser(shifts: readonly DatedShift[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of shifts) map.set(s.userId, (map.get(s.userId) ?? 0) + shiftMinutes(s));
  return map;
}

export type HoursRow = { userId: string; planned: number; target: number; status: WeeklyStatus };

/** Riepilogo ore per ogni membro in un intervallo (tipicamente una settimana). */
export function hoursSummary(
  members: readonly { id: string; weeklyMinutes: number }[],
  shifts: readonly DatedShift[],
): HoursRow[] {
  const planned = minutesByUser(shifts);
  return members.map((m) => {
    const p = planned.get(m.id) ?? 0;
    return { userId: m.id, planned: p, target: m.weeklyMinutes, status: weeklyStatus(p, m.weeklyMinutes) };
  });
}
