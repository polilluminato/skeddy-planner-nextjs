import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { BIP39_IT } from "@/config/bip39-it";
import { PERSONAL_CODE_ALPHABET, PERSONAL_CODE_LENGTH } from "@/lib/domain/personal-code";

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

const pick = (items: ArrayLike<string>, n: number) => Array.from({ length: n }, () => items[randomInt(items.length)]);

/** Codice azienda: 4 parole della wordlist BIP39 italiana separate da "-". */
export function generateCompanyCode(): string {
  return pick(BIP39_IT, 4).join("-");
}

export function generatePersonalCode(): string {
  return pick(PERSONAL_CODE_ALPHABET, PERSONAL_CODE_LENGTH).join("");
}
