import { describe, expect, it } from "vitest";
import { BIP39_IT } from "@/config/bip39-it";
import { generateCompanyCode, isValidCompanyCode, normalizeCompanyCode } from "./company-code";

describe("company code", () => {
  it("usa la wordlist completa", () => {
    expect(BIP39_IT).toHaveLength(2048);
    expect(new Set(BIP39_IT).size).toBe(2048);
  });

  it("genera 4 parole valide separate da trattino", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCompanyCode();
      expect(code.split("-")).toHaveLength(4);
      expect(isValidCompanyCode(code)).toBe(true);
    }
  });

  it("normalizza maiuscole, spazi e separatori", () => {
    expect(normalizeCompanyCode("  Abaco  Zuppa-ZINCO.acqua ")).toBe("abaco-zuppa-zinco-acqua");
  });

  it("rifiuta codici malformati", () => {
    expect(isValidCompanyCode("abaco-zuppa-zinco")).toBe(false);
    expect(isValidCompanyCode("abaco-zuppa-zinco-parolainventata")).toBe(false);
  });
});
