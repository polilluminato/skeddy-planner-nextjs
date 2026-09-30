import { z } from "zod";
import { isISODate } from "@/lib/domain/dates";
import { isValidRange, isValidTime } from "@/lib/domain/shifts";

const timeField = (label: string) =>
  z.string({ error: `${label} obbligatoria.` }).refine(isValidTime, `${label} non valida (HH:MM).`);

export const shiftSchema = z
  .object({
    userId: z.string({ error: "Scegli un dipendente." }).min(1, "Scegli un dipendente."),
    date: z.string({ error: "Data obbligatoria." }).refine(isISODate, "Data non valida."),
    start: timeField("Ora di inizio"),
    end: timeField("Ora di fine"),
    note: z
      .string()
      .trim()
      .max(200, "Nota: massimo 200 caratteri.")
      .optional()
      .transform((v) => (v ? v : null)),
  })
  .refine(isValidRange, { message: "L'ora di fine deve essere successiva all'inizio.", path: ["end"] });

export type ShiftInput = z.infer<typeof shiftSchema>;
