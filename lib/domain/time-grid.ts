import { shiftMinutes, sortByStart, timeToMinutes, type TimeRange } from "./shifts";

export type HourRange = { from: number; to: number };

/** Fascia mostrata di default nella griglia oraria (ore intere, `to` esclusa). */
const DEFAULT_HOURS: HourRange = { from: 8, to: 20 };

const LAST_MINUTE = 23 * 60 + 59;

/** Ore visibili: almeno la fascia di default, allargata per contenere tutti i turni. */
export function visibleHours(shifts: readonly TimeRange[]): HourRange {
  let { from, to } = DEFAULT_HOURS;
  for (const s of shifts) {
    from = Math.min(from, Math.floor(timeToMinutes(s.start) / 60));
    to = Math.max(to, Math.ceil(timeToMinutes(s.end) / 60));
  }
  return { from, to };
}

export type Placement<T> = { item: T; column: number; columns: number };

/**
 * Disposizione stile Google Calendar: i turni che si sovrappongono (anche di persone
 * diverse) formano un gruppo e si affiancano in colonne; ogni turno occupa la prima
 * colonna libera e tutti i turni del gruppo condividono lo stesso numero di colonne.
 */
export function layoutOverlaps<T extends TimeRange>(shifts: readonly T[]): Placement<T>[] {
  const result: Placement<T>[] = [];
  let group: Placement<T>[] = [];
  let columnEnds: number[] = [];
  let groupEnd = -1;

  const closeGroup = () => {
    for (const p of group) p.columns = columnEnds.length;
    result.push(...group);
    group = [];
    columnEnds = [];
  };

  for (const item of sortByStart(shifts)) {
    const start = timeToMinutes(item.start);
    const end = timeToMinutes(item.end);
    if (start >= groupEnd) closeGroup();
    groupEnd = Math.max(groupEnd, end);

    let column = columnEnds.findIndex((e) => e <= start);
    if (column === -1) column = columnEnds.push(end) - 1;
    else columnEnds[column] = end;
    group.push({ item, column, columns: 0 });
  }
  closeGroup();
  return result;
}

/** Quanto si allarga un turno oltre la sua colonna, sovrapponendosi in parte al vicino (come Google Calendar). */
const OVERLAP_STRETCH = 1.7;

/**
 * Posizione orizzontale (in %) di un turno nel suo gruppo: parte dalla sua colonna e si allarga
 * verso destra; l'ultima colonna arriva al bordo. I turni dopo (iniziano più tardi) stanno sopra.
 */
export function horizontalPosition(column: number, columns: number): { left: number; width: number } {
  const left = (column / columns) * 100;
  const width = column === columns - 1 ? 100 - left : Math.min(100 - left, (100 / columns) * OVERLAP_STRETCH);
  return { left, width };
}

/** Posizione verticale (in % della fascia visibile) di un intervallo orario. */
export function verticalPosition(range: TimeRange, hours: HourRange): { top: number; height: number } {
  const total = (hours.to - hours.from) * 60;
  const offset = timeToMinutes(range.start) - hours.from * 60;
  return { top: (offset / total) * 100, height: (shiftMinutes(range) / total) * 100 };
}

/** Posizione (in %) di un istante della giornata; null se fuori dalla fascia visibile. */
export function minuteOffset(minutes: number, hours: HourRange): number | null {
  if (minutes < hours.from * 60 || minutes > hours.to * 60) return null;
  return ((minutes - hours.from * 60) / ((hours.to - hours.from) * 60)) * 100;
}

export function minutesToTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(LAST_MINUTE, minutes));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(clamped % 60).padStart(2, "0")}`;
}

/** Orario proposto cliccando su uno slot libero: dalla mezz'ora dell'ora scelta, 4 ore, senza passare la mezzanotte. */
export function slotRange(hour: number): TimeRange {
  const start = Math.max(0, Math.min(23, hour)) * 60 + 30;
  return { start: minutesToTime(start), end: minutesToTime(Math.min(start + 240, LAST_MINUTE)) };
}
