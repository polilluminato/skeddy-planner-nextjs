import { addDays, isISODate, startOfWeek, type ISODate } from "./dates";

export const CALENDAR_VIEWS = ["day", "week"] as const;
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
  return addDays(date, view === "day" ? direction : 7 * direction);
}

/** Intervallo di date (inclusivo) da caricare per la vista. */
export function visibleRange({ view, date }: CalendarState): { from: ISODate; to: ISODate } {
  if (view === "day") return { from: date, to: date };
  const from = startOfWeek(date);
  return { from, to: addDays(from, 6) };
}

export function calendarHref(state: CalendarState): string {
  return `/calendar?view=${state.view}&date=${state.date}`;
}

