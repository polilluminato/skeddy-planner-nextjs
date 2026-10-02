/** Alfabeto senza caratteri ambigui (0 O 1 I L) per dettare il codice senza errori. */
export const PERSONAL_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const PERSONAL_CODE_LENGTH = 8;

export function normalizePersonalCode(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidPersonalCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

/** Formato di lettura: "ABCD EFGH". */
export function formatPersonalCode(code: string): string {
  return `${code.slice(0, 4)} ${code.slice(4)}`;
}
