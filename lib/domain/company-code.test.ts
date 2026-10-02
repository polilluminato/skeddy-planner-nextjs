import { describe, expect, it } from "vitest";
import { BIP39_IT } from "@/config/bip39-it";
import { generateCompanyCode } from "@/lib/auth/crypto";
import { normalizeCompanyCode } from "./company-code";

describe("company code", () => {
  it("usa la wordlist completa", () => {
    expect(BIP39_IT).toHaveLength(2048);
    expect(new Set(BIP39_IT).size).toBe(2048);
  });

  it("genera 4 parole della wordlist separate da trattino", () => {
    for (let i = 0; i < 50; i++) {
      const words = generateCompanyCode().split("-");
      expect(words).toHaveLength(4);
      for (const w of words) expect(BIP39_IT).toContain(w);
    }
  });

  it("normalizza maiuscole, spazi e separatori", () => {
    expect(normalizeCompanyCode("  Abaco  Zuppa-ZINCO.acqua ")).toBe("abaco-zuppa-zinco-acqua");
  });
});
