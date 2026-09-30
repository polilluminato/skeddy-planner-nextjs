import { z } from "zod";

export const nameField = (label: string) =>
  z
    .string({ error: `${label} obbligatorio.` })
    .trim()
    .min(1, `${label} obbligatorio.`)
    .max(50, `${label}: massimo 50 caratteri.`);

export const emailField = z
  .string({ error: "Email obbligatoria." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Email non valida."));

export const passwordField = z
  .string({ error: "Password obbligatoria." })
  .min(10, "La password deve avere almeno 10 caratteri.")
  .max(128, "La password può avere al massimo 128 caratteri.");
