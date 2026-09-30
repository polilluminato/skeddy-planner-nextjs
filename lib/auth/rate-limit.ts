import "server-only";
import { prisma } from "@/lib/prisma";
import { afterFailure, isLocked, minutesLeft } from "@/lib/domain/rate-limit";

/** Messaggio di blocco se la chiave è bloccata, altrimenti null. */
export async function lockMessage(key: string): Promise<string | null> {
  const now = new Date();
  const state = await prisma.loginAttempt.findUnique({ where: { key } });
  if (!state || !isLocked(state, now)) return null;
  const minutes = minutesLeft(state.lockedUntil!, now);
  return `Troppi tentativi. Riprova tra ${minutes} ${minutes === 1 ? "minuto" : "minuti"}.`;
}

export async function registerFailure(key: string): Promise<void> {
  const state = await prisma.loginAttempt.findUnique({ where: { key } });
  const next = afterFailure(state, new Date());
  await prisma.loginAttempt.upsert({
    where: { key },
    create: { key, ...next },
    update: next,
  });
}

export async function clearAttempts(key: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { key } });
}
