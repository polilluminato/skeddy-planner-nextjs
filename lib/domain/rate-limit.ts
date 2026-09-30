export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

export type AttemptState = { count: number; lockedUntil: Date | null };

export function isLocked(state: AttemptState | null, now: Date): boolean {
  return !!state?.lockedUntil && state.lockedUntil > now;
}

/** Stato dopo un tentativo fallito: al quinto errore scatta il blocco e il contatore riparte. */
export function afterFailure(state: AttemptState | null, now: Date): AttemptState {
  const expiredLock = !!state?.lockedUntil && state.lockedUntil <= now;
  const count = (expiredLock || !state ? 0 : state.count) + 1;
  if (count >= MAX_ATTEMPTS) {
    return { count: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) };
  }
  return { count, lockedUntil: null };
}

export function minutesLeft(lockedUntil: Date, now: Date): number {
  return Math.max(1, Math.ceil((lockedUntil.getTime() - now.getTime()) / 60_000));
}
