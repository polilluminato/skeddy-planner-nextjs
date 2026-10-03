import { APP_LOCALE, APP_TIME_ZONE } from "@/config/app";
import { addDays, startOfWeek, toUTCDate, type ISODate } from "./dates";

// Le date ISO sono mezzanotte UTC: si formattano in UTC per non cambiare giorno.
const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(APP_LOCALE, { timeZone: "UTC", ...options });

const longDay = fmt({ weekday: "long", day: "numeric", month: "long" });
const shortWeekday = fmt({ weekday: "short" });
const dayMonth = fmt({ day: "numeric", month: "short" });
const dayMonthYear = fmt({ day: "numeric", month: "short", year: "numeric" });
const monthYear = fmt({ month: "long", year: "numeric" });
const numericDate = fmt({ day: "2-digit", month: "2-digit", year: "numeric" });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Mercoledì 30 settembre" */
export function formatLongDay(iso: ISODate): string {
  return capitalize(longDay.format(toUTCDate(iso)));
}

/** "mer" */
export function formatShortWeekday(iso: ISODate): string {
  return shortWeekday.format(toUTCDate(iso)).replace(".", "");
}

/** "02/10/2026" */
export function formatNumericDate(iso: ISODate): string {
  return numericDate.format(toUTCDate(iso));
}

/** "Settembre 2026" */
export function formatMonthYear(iso: ISODate): string {
  return capitalize(monthYear.format(toUTCDate(iso)));
}

/** "28 set – 4 ott 2026" */
export function formatWeekRange(iso: ISODate): string {
  const from = startOfWeek(iso);
  const to = addDays(from, 6);
  return `${dayMonth.format(toUTCDate(from))} – ${dayMonthYear.format(toUTCDate(to))}`;
}

export function dayOfMonth(iso: ISODate): number {
  return Number(iso.slice(8, 10));
}

const clock = new Intl.DateTimeFormat(APP_LOCALE, {
  timeZone: APP_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "14:05" nel fuso dell'app (per istanti reali, non per date ISO). */
export function formatClock(date: Date): string {
  return clock.format(date);
}
