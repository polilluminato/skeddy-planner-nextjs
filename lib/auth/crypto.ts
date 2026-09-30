import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Hash interrogabile del codice personale: HMAC con un segreto che non sta nel DB. */
export function hmacCode(code: string, secret: string): string {
  return createHmac("sha256", secret).update(code).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Confronto a tempo costante anche tra stringhe di lunghezza diversa. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
