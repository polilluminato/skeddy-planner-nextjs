"use server";

import { revalidatePath } from "next/cache";
import { firstError, type ActionState } from "@/lib/action-state";
import { requireAdmin, requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validation/message";

export async function sendMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { companyId, user } = await requireAdmin();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: { companyId, authorId: user.id, body: parsed.data.body },
      select: { createdAt: true },
    });
    // Chi scrive ha già letto: il proprio messaggio non conta tra i non letti.
    await tx.user.updateMany({ where: { id: user.id, companyId }, data: { messagesReadAt: message.createdAt } });
  });

  revalidatePath("/messages");
  return { ok: true };
}

export async function deleteMessage(messageId: string): Promise<ActionState> {
  const { companyId } = await requireAdmin();
  const { count } = await prisma.message.deleteMany({ where: { id: messageId, companyId } });
  if (count === 0) return { error: "Messaggio non trovato." };
  revalidatePath("/messages");
  return { ok: true };
}

export async function markMessagesRead(): Promise<ActionState> {
  const { companyId, user } = await requireUser();
  await prisma.user.updateMany({ where: { id: user.id, companyId }, data: { messagesReadAt: new Date() } });
  return { ok: true };
}
