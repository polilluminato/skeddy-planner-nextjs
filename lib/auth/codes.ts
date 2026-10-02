import "server-only";
import { generatePersonalCode, hmacCode } from "./crypto";

function authSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET mancante o troppo corto (min 16 caratteri).");
  }
  return secret;
}

export function hashPersonalCode(code: string): string {
  return hmacCode(code, authSecret());
}

/** Nuovo codice personale con il suo hash; l'unicità è garantita dall'indice su codeHash. */
export function newPersonalCode(): { code: string; codeHash: string } {
  const code = generatePersonalCode();
  return { code, codeHash: hashPersonalCode(code) };
}
