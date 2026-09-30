import { addDays, addMonths, isISODate, monthGrid, startOfWeek, type ISODate } from "./dates";

export const CALENDAR_VIEWS = ["day", "week", "month"] as const;
export type CalendarView = (typeof CALENDAR_VIEWS)[number];

export type CalendarState = { view: CalendarView; date: ISODate };

/** Stato del calendario dai searchParams, con fallback sicuri. */
export function parseCalendarState(
  params: { view?: string | string[]; date?: string | string[] },
  today: ISODate,
): CalendarState {
  const view = typeof params.view === "string" && (CALENDAR_VIEWS as readonly string[]).includes(params.view)
    ? (params.view as CalendarView)
    : "week";
  const date = typeof params.date === "string" && isISODate(params.date) ? params.date : today;
  return { view, date };
}

/** Data di arrivo spostandosi di un periodo avanti (+1) o indietro (-1). */
export function shiftPeriod({ view, date }: CalendarState, direction: 1 | -1): ISODate {
  if (view === "day") return addDays(date, direction);
  if (view === "week") return addDays(date, 7 * direction);
  return addMonths(date, direction);
}

/** Intervallo di date (inclusivo) da caricare per la vista. */
export function visibleRange({ view, date }: CalendarState): { from: ISODate; to: ISODate } {
  if (view === "day") return { from: date, to: date };
  if (view === "week") {
    const from = startOfWeek(date);
    return { from, to: addDays(from, 6) };
  }
  const grid = monthGrid(date);
  return { from: grid[0][0], to: grid.at(-1)!.at(-1)! };
}

export function calendarHref(state: CalendarState): string {
  return `/calendar?view=${state.view}&date=${state.date}`;
}

