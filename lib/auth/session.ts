import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/config/app";
import { prisma } from "@/lib/prisma";
import { randomToken, sha256 } from "./crypto";

export const SESSION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Rinnovo scorrevole: se mancano meno di 15 giorni, la scadenza riparte da capo. */
const RENEW_THRESHOLD_MS = 15 * DAY_MS;

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export async function createSession(target: { userId: string } | { superAdmin: true }): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      expiresAt,
      ...("userId" in target ? { userId: target.userId } : { isSuperAdmin: true }),
    },
  });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  store.delete(SESSION_COOKIE);
}

/** Chiude tutte le sessioni di un utente (es. codice rigenerato o utente eliminato). */
export async function destroyUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

const sessionInclude = {
  user: { include: { company: true } },
} as const;

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: sessionInclude,
  });
  if (!session) return null;

  const now = Date.now();
  if (session.expiresAt.getTime() <= now) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }
  if (session.expiresAt.getTime() - now < RENEW_THRESHOLD_MS) {
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(now + SESSION_DAYS * DAY_MS) },
    });
  }
  return session;
});

export type AppSession = NonNullable<Awaited<ReturnType<typeof getSession>>>;
