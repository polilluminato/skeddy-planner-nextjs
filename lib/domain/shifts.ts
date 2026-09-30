export type TimeRange = { start: string; end: string };
export type ShiftLike = TimeRange & { id?: string };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(value: string): boolean {
  return TIME_RE.test(value);
}

export function timeToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

/** Un turno vive in un solo giorno: la fine deve essere successiva all'inizio. */
export function isValidRange({ start, end }: TimeRange): boolean {
  return isValidTime(start) && isValidTime(end) && timeToMinutes(end) > timeToMinutes(start);
}

export function shiftMinutes({ start, end }: TimeRange): number {
  return timeToMinutes(end) - timeToMinutes(start);
}

/** Intervalli semiaperti: 08:00–12:00 e 12:00–16:00 non si sovrappongono. */
export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return timeToMinutes(a.start) < timeToMinutes(b.end) && timeToMinutes(b.start) < timeToMinutes(a.end);
}

/** Primo turno esistente (stesso utente, stesso giorno) che si sovrappone, escluso quello in modifica. */
export function findOverlap<T extends ShiftLike>(
  candidate: ShiftLike,
  existing: readonly T[],
): T | undefined {
  return existing.find((s) => s.id !== candidate.id && rangesOverlap(candidate, s));
}

export function totalMinutes(shifts: readonly TimeRange[]): number {
  return shifts.reduce((sum, s) => sum + shiftMinutes(s), 0);
}

export function sortByStart<T extends TimeRange>(shifts: readonly T[]): T[] {
  return [...shifts].sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
}

export type WeeklyStatus = "unset" | "under" | "ok" | "over";

/** Confronto tra ore pianificate e ore previste; nessun blocco, solo un'indicazione. */
export function weeklyStatus(plannedMinutes: number, targetMinutes: number): WeeklyStatus {
  if (targetMinutes <= 0) return "unset";
  if (plannedMinutes < targetMinutes) return "under";
  if (plannedMinutes > targetMinutes) return "over";
  return "ok";
}

/** 450 → "7h 30m", 480 → "8h", 0 → "0h". */
export function formatMinutes(minutes: number): string {
  const sign = minutes < 0 ? "-" : "";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${String(m).padStart(2, "0")}m`;
}

/** "38" o "37,5" (ore) → minuti; null se non valido. */
export function parseHours(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(normalized)) return null;
  const minutes = Math.round(Number(normalized) * 60);
  return minutes >= 0 && minutes <= 168 * 60 ? minutes : null;
}

/** Minuti → ore per un campo di input ("37,5"). */
export function minutesToHoursInput(minutes: number): string {
  const hours = minutes / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(2).replace(/0$/, "").replace(".", ",");
}
