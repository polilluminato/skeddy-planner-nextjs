import { describe, expect, it } from "vitest";
import { firstError } from "@/lib/action-state";
import { changePasswordSchema, codeLoginSchema, signupSchema } from "./auth";
import { employeeSchema } from "./employee";
import { messageSchema } from "./message";
import { shiftSchema } from "./shift";

describe("validation", () => {
  it("normalizza i codici di accesso", () => {
    const r = codeLoginSchema.parse({ companyCode: " Abaco Zuppa zinco ACQUA", personalCode: "abcd efgh" });
    expect(r).toEqual({ companyCode: "abaco-zuppa-zinco-acqua", personalCode: "ABCDEFGH" });
  });

  it("valida la registrazione", () => {
    const bad = signupSchema.safeParse({
      companyName: "Bar",
      firstName: "Ada",
      lastName: "Rossi",
      email: "non-email",
      password: "1234567890",
    });
    expect(bad.success).toBe(false);
    if (!bad.success) expect(firstError(bad.error)).toBe("Email non valida.");

    const ok = signupSchema.parse({
      companyName: " Bar Centrale ",
      firstName: "Ada",
      lastName: "Rossi",
      email: " Ada@Example.COM ",
      password: "1234567890",
    });
    expect(ok.email).toBe("ada@example.com");
    expect(ok.companyName).toBe("Bar Centrale");
  });

  it("controlla la conferma password", () => {
    const r = changePasswordSchema.safeParse({
      currentPassword: "x",
      newPassword: "1234567890",
      confirmPassword: "0987654321",
    });
    expect(r.success).toBe(false);
  });

  it("converte le ore settimanali in minuti", () => {
    const r = employeeSchema.parse({ firstName: "Ada", lastName: "Rossi", weeklyHours: "37,5", color: "#2a74c4" });
    expect(r.weeklyHours).toBe(2250);
    expect(employeeSchema.parse({ firstName: "A", lastName: "B", weeklyHours: "", color: "#2a74c4" }).weeklyHours).toBe(0);
    expect(employeeSchema.safeParse({ firstName: "A", lastName: "B", weeklyHours: "x", color: "#2a74c4" }).success).toBe(false);
    expect(employeeSchema.safeParse({ firstName: "A", lastName: "B", weeklyHours: "1", color: "red" }).success).toBe(false);
  });

  it("valida il turno", () => {
    const base = { userId: "u1", date: "2026-09-30", start: "08:00", end: "12:00" };
    expect(shiftSchema.parse({ ...base, note: "" }).note).toBeNull();
    expect(shiftSchema.parse({ ...base, note: " cassa " }).note).toBe("cassa");
    const r = shiftSchema.safeParse({ ...base, end: "07:00" });
    expect(r.success).toBe(false);
    if (!r.success) expect(firstError(r.error)).toBe("L'ora di fine deve essere successiva all'inizio.");
  });

  it("valida il messaggio", () => {
    expect(messageSchema.parse({ body: "  Riunione alle 9\n  " }).body).toBe("Riunione alle 9");
    const empty = messageSchema.safeParse({ body: "   " });
    expect(empty.success).toBe(false);
    if (!empty.success) expect(firstError(empty.error)).toBe("Scrivi un messaggio.");
    expect(messageSchema.safeParse({}).success).toBe(false);
    expect(messageSchema.safeParse({ body: "x".repeat(1001) }).success).toBe(false);
  });
});
