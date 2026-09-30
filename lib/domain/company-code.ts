import { BIP39_IT } from "@/config/bip39-it";
import { randomInt } from "./random";

export const COMPANY_CODE_WORDS = 4;

/** Codice azienda: 4 parole della wordlist BIP39 italiana separate da "-". */
export function generateCompanyCode(words: readonly string[] = BIP39_IT): string {
  return Array.from({ length: COMPANY_CODE_WORDS }, () => words[randomInt(words.length)]).join("-");
}

/** Normalizza l'input dell'utente: minuscole, spazi/punti/trattini multipli → un solo "-". */
export function normalizeCompanyCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z]+/)
    .filter(Boolean)
    .join("-");
}

export function isValidCompanyCode(code: string, words: readonly string[] = BIP39_IT): boolean {
  const parts = code.split("-");
  const set = new Set(words);
  return parts.length === COMPANY_CODE_WORDS && parts.every((p) => set.has(p));
}
