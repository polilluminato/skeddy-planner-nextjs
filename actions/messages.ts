"use server";

import { revalidatePath } from "next/cache";
import { firstError, type ActionState } from "@/lib/action-state";
import { requireAdmin, requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validation/message";

export async function sendMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { companyId, meId, isSupervisor } = await requireAdmin();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  await prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: { companyId, authorId: meId, fromOrganization: isSupervisor, body: parsed.data.body },
      select: { createdAt: true },
    });
    // Chi scrive ha già letto: il proprio messaggio non conta tra i non letti.
    if (meId) {
      await tx.user.updateMany({ where: { id: meId, companyId }, data: { messagesReadAt: message.createdAt } });
    }
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
  const { companyId, meId } = await requireUser();
  // L'Amministrazione non ha uno stato di lettura: non è un membro del team.
  if (meId) await prisma.user.updateMany({ where: { id: meId, companyId }, data: { messagesReadAt: new Date() } });
  return { ok: true };
}
