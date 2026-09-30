import type { z } from "zod";

/** Ritorno comune delle Server Actions. I campi extra sono dati una tantum (es. un codice appena generato). */
export type ActionState<T extends object = object> = {
  ok?: boolean;
  error?: string;
} & Partial<T>;

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dati non validi.";
}
