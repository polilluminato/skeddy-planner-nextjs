import { z } from "zod";
import { normalizeCompanyCode } from "@/lib/domain/company-code";
import { normalizePersonalCode } from "@/lib/domain/personal-code";
import { emailField, nameField, passwordField } from "./fields";

export const signupSchema = z.object({
  companyName: z
    .string({ error: "Nome azienda obbligatorio." })
    .trim()
    .min(2, "Il nome dell'azienda deve avere almeno 2 caratteri.")
    .max(80, "Nome azienda: massimo 80 caratteri."),
  firstName: nameField("Nome"),
  lastName: nameField("Cognome"),
  email: emailField,
  password: passwordField,
});

export const codeLoginSchema = z.object({
  companyCode: z
    .string({ error: "Inserisci il codice azienda." })
    .transform(normalizeCompanyCode)
    .pipe(z.string().min(1, "Inserisci il codice azienda.")),
  personalCode: z
    .string({ error: "Inserisci il codice personale." })
    .transform(normalizePersonalCode)
    .pipe(z.string().regex(/^[A-Z0-9]{8}$/, "Il codice personale ha 8 caratteri.")),
});

export const emailLoginSchema = z.object({
  email: emailField,
  password: z.string({ error: "Inserisci la password." }).min(1, "Inserisci la password."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Inserisci la password attuale."),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Le due password non coincidono.",
    path: ["confirmPassword"],
  });
