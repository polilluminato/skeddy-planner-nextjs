import { z } from "zod";
import { EMPLOYEE_COLOR_VALUES } from "@/config/colors";
import { parseHours } from "@/lib/domain/shifts";
import { nameField } from "./fields";

export const employeeSchema = z.object({
  firstName: nameField("Nome"),
  lastName: nameField("Cognome"),
  weeklyHours: z
    .string({ error: "Indica le ore settimanali." })
    .transform((v, ctx) => {
      const minutes = parseHours(v === "" ? "0" : v);
      if (minutes === null) {
        ctx.addIssue({ code: "custom", message: "Ore settimanali non valide (es. 38 o 37,5)." });
        return z.NEVER;
      }
      return minutes;
    }),
  color: z.string().refine((c) => EMPLOYEE_COLOR_VALUES.includes(c), "Colore non valido."),
});
