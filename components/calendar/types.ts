export type CalendarMember = { id: string; firstName: string; lastName: string; color: string };
export type CalendarShift = {
  id: string;
  userId: string;
  date: string;
  start: string;
  end: string;
  note: string | null;
};

export function memberName(m: Pick<CalendarMember, "firstName" | "lastName">): string {
  return `${m.firstName} ${m.lastName}`;
}

/** Sfondo tenue dal colore del dipendente: si adatta al tema grazie a var(--card). */
export function tint(color: string, percent = 12): string {
  return `color-mix(in srgb, ${color} ${percent}%, var(--card))`;
}
