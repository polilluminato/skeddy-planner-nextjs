/**
 * Date senza orario come stringhe ISO "YYYY-MM-DD". I calcoli avvengono in UTC
 * su mezzanotte, così il fuso del server non sposta mai il giorno.
 */
export type ISODate = string;

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(value: string): boolean {
  if (!ISO_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function toUTCDate(iso: ISODate): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function fromUTCDate(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

/** "Oggi" nel fuso indicato. */
export function todayISO(timeZone: string, now: Date = new Date()): ISODate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = toUTCDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUTCDate(d);
}

/** Aggiunge mesi mantenendo il giorno, limitato all'ultimo giorno del mese di arrivo. */
export function addMonths(iso: ISODate, months: number): ISODate {
  const d = toUTCDate(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return fromUTCDate(d);
}

/** 0 = lunedì … 6 = domenica. */
export function weekdayIndex(iso: ISODate): number {
  return (toUTCDate(iso).getUTCDay() + 6) % 7;
}

/** Lunedì della settimana (ISO) che contiene la data. */
export function startOfWeek(iso: ISODate): ISODate {
  return addDays(iso, -weekdayIndex(iso));
}

export function weekDays(iso: ISODate): ISODate[] {
  const start = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function startOfMonth(iso: ISODate): ISODate {
  return `${iso.slice(0, 7)}-01`;
}

export function endOfMonth(iso: ISODate): ISODate {
  return addDays(addMonths(startOfMonth(iso), 1), -1);
}

export function isSameMonth(a: ISODate, b: ISODate): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

/** Settimane (lun–dom) che coprono il mese della data. */
export function monthGrid(iso: ISODate): ISODate[][] {
  const first = startOfWeek(startOfMonth(iso));
  const last = endOfMonth(iso);
  const weeks: ISODate[][] = [];
  for (let start = first; start <= last; start = addDays(start, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(start, i)));
  }
  return weeks;
}
