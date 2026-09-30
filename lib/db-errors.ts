import { Prisma } from "@/generated/prisma/client";

export function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** Riprova un'operazione se fallisce per un vincolo di unicità (codici generati in collisione). */
export async function retryOnUnique<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (error) {
      if (!isUniqueViolation(error) || i >= attempts) throw error;
    }
  }
}
