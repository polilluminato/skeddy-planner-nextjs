import { describe, expect, it } from "vitest";
import {
  formatPersonalCode,
  generatePersonalCode,
  isValidPersonalCode,
  normalizePersonalCode,
  PERSONAL_CODE_ALPHABET,
} from "./personal-code";

describe("personal code", () => {
  it("genera 8 caratteri maiuscoli alfanumerici non ambigui", () => {
    for (let i = 0; i < 100; i++) {
      const code = generatePersonalCode();
      expect(isValidPersonalCode(code)).toBe(true);
      for (const ch of code) expect(PERSONAL_CODE_ALPHABET).toContain(ch);
    }
  });

  it("normalizza spazi, trattini e minuscole", () => {
    expect(normalizePersonalCode(" abcd-ef gh ")).toBe("ABCDEFGH");
  });

  it("formatta in due gruppi", () => {
    expect(formatPersonalCode("ABCDEFGH")).toBe("ABCD EFGH");
  });

  it("rifiuta lunghezze errate", () => {
    expect(isValidPersonalCode("ABC")).toBe(false);
    expect(isValidPersonalCode("ABCDEFGH1")).toBe(false);
  });
});
