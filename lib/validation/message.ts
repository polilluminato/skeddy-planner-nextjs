import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "@/config/app";

export const messageSchema = z.object({
  body: z
    .string({ error: "Scrivi un messaggio." })
    .trim()
    .min(1, "Scrivi un messaggio.")
    .max(MAX_MESSAGE_LENGTH, `Massimo ${MAX_MESSAGE_LENGTH} caratteri.`),
});
