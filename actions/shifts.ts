"use server";

import { revalidatePath } from "next/cache";
import { firstError, type ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth/guards";
import { toUTCDate } from "@/lib/domain/dates";
import { findOverlap } from "@/lib/domain/shifts";
import { prisma } from "@/lib/prisma";
import { shiftSchema } from "@/lib/validation/shift";

function revalidateShifts() {
  revalidatePath("/calendar");
  revalidatePath("/team", "layout");
  revalidatePath("/profile");
}

export async function saveShift(
  shiftId: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { companyId } = await requireAdmin();
  const parsed = shiftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { userId, date, start, end, note } = parsed.data;

  const employee = await prisma.user.findFirst({ where: { id: userId, companyId }, select: { id: true } });
  if (!employee) return { error: "Dipendente non trovato." };

  const day = toUTCDate(date);
  const result = await prisma.$transaction(
    async (tx): Promise<ActionState> => {
      const sameDay = await tx.shift.findMany({
        where: { companyId, userId, date: day },
        select: { id: true, start: true, end: true },
      });
      const clash = findOverlap({ id: shiftId ?? undefined, start, end }, sameDay);
      if (clash) {
        return { error: `Si sovrappone a un turno esistente (${clash.start}–${clash.end}).` };
      }

      if (shiftId) {
        const { count } = await tx.shift.updateMany({
          where: { id: shiftId, companyId },
          data: { userId, date: day, start, end, note },
        });
        if (count === 0) return { error: "Turno non trovato." };
      } else {
        await tx.shift.create({ data: { companyId, userId, date: day, start, end, note } });
      }
      return { ok: true };
    },
    { isolationLevel: "Serializable" },
  );

  if (result.ok) revalidateShifts();
  return result;
}

export async function deleteShift(shiftId: string): Promise<ActionState> {
  const { companyId } = await requireAdmin();
  const { count } = await prisma.shift.deleteMany({ where: { id: shiftId, companyId } });
  if (count === 0) return { error: "Turno non trovato." };
  revalidateShifts();
  return { ok: true };
}
