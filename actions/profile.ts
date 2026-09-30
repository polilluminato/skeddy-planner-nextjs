"use server";

import { firstError, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validation/auth";

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { user, companyId } = await requireUser();
  if (!user.passwordHash) return { error: "Il tuo account accede solo con i codici." };

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  if (!(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { error: "La password attuale non è corretta." };
  }

  await prisma.user.updateMany({
    where: { id: user.id, companyId },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return { ok: true };
}
