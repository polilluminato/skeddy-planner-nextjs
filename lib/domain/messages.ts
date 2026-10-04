import { APP_TIME_ZONE, MESSAGES_MAX_LIMIT, MESSAGES_PAGE_SIZE } from "@/config/app";
import { addDays, todayISO } from "./dates";
import { formatClock, formatLongDay } from "./format";

export type MessageAuthor = { id: string; firstName: string; lastName: string; color: string };

export type MessageRow = {
  id: string;
  body: string;
  createdAt: Date;
  author: MessageAuthor | null;
  /** Scritto dall'Amministrazione: non ha un autore tra i membri. */
  fromOrganization: boolean;
};

export type TimelineItem =
  | { kind: "day"; key: string; label: string }
  | {
      kind: "message";
      key: string;
      id: string;
      body: string;
      /** ISO completo, per <time dateTime> */
      sentAt: string;
      time: string;
      authorName: string;
      authorColor: string | null;
      mine: boolean;
    };

/**
 * Messaggi in ordine cronologico con un separatore a ogni cambio di giorno (nel fuso dell'app).
 * `meId` è null per l'Amministrazione (`isSupervisor`), per cui "miei" sono i messaggi dell'organizzazione.
 */
export function buildTimeline(
  messages: MessageRow[],
  { meId, isSupervisor = false, now = new Date() }: { meId: string | null; isSupervisor?: boolean; now?: Date },
): TimelineItem[] {
  const today = todayISO(APP_TIME_ZONE, now);
  const yesterday = addDays(today, -1);
  const items: TimelineItem[] = [];
  let lastDay: string | null = null;

  for (const m of messages) {
    const day = todayISO(APP_TIME_ZONE, m.createdAt);
    if (day !== lastDay) {
      const label = day === today ? "Oggi" : day === yesterday ? "Ieri" : formatLongDay(day);
      items.push({ kind: "day", key: `day-${day}`, label });
      lastDay = day;
    }
    items.push({
      kind: "message",
      key: m.id,
      id: m.id,
      body: m.body,
      sentAt: m.createdAt.toISOString(),
      time: formatClock(m.createdAt),
      authorName: m.fromOrganization
        ? "Amministrazione"
        : m.author
          ? `${m.author.firstName} ${m.author.lastName}`
          : "Ex amministratore",
      authorColor: m.author?.color ?? null,
      mine: m.fromOrganization ? isSupervisor : m.author !== null && m.author.id === meId,
    });
  }
  return items;
}

/** Primo messaggio scritto da altri dopo l'ultima lettura, o null se è tutto letto. */
export function firstUnreadId(messages: MessageRow[], readAt: Date, meId: string): string | null {
  const first = messages.find((m) => m.createdAt > readAt && m.author?.id !== meId);
  return first?.id ?? null;
}

/** Quanti messaggi mostrare, dal parametro `?n=`: multipli della pagina, entro il massimo. */
export function parseMessageLimit(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isFinite(n) || n <= MESSAGES_PAGE_SIZE) return MESSAGES_PAGE_SIZE;
  return Math.min(Math.ceil(n / MESSAGES_PAGE_SIZE) * MESSAGES_PAGE_SIZE, MESSAGES_MAX_LIMIT);
}
