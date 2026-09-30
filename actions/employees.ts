"use server";

import { revalidatePath } from "next/cache";
import { MAX_ADMINS } from "@/config/app";
import { firstError, type ActionState } from "@/lib/action-state";
import { newPersonalCode } from "@/lib/auth/codes";
import { requireAdmin } from "@/lib/auth/guards";
import { destroyUserSessions } from "@/lib/auth/session";
import { retryOnUnique } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validation/employee";

export type CodeResult = ActionState<{ personalCode: string; name: string }>;

function revalidateTeam() {
  revalidatePath("/team", "layout");
  revalidatePath("/calendar");
}

export async function createEmployee(_prev: CodeResult, formData: FormData): Promise<CodeResult> {
  const { companyId } = await requireAdmin();
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { firstName, lastName, weeklyHours, color } = parsed.data;

  const personalCode = await retryOnUnique(async () => {
    const { code, codeHash } = newPersonalCode();
    await prisma.user.create({
      data: { companyId, firstName, lastName, weeklyMinutes: weeklyHours, color, codeHash, role: "EMPLOYEE" },
    });
    return code;
  });

  revalidateTeam();
  return { ok: true, personalCode, name: `${firstName} ${lastName}` };
}

export async function updateEmployee(
  employeeId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { companyId } = await requireAdmin();
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { firstName, lastName, weeklyHours, color } = parsed.data;

  const { count } = await prisma.user.updateMany({
    where: { id: employeeId, companyId },
    data: { firstName, lastName, weeklyMinutes: weeklyHours, color },
  });
  if (count === 0) return { error: "Dipendente non trovato." };

  revalidateTeam();
  return { ok: true };
}

export async function deleteEmployee(employeeId: string): Promise<ActionState> {
  const { companyId, user } = await requireAdmin();
  if (employeeId === user.id) return { error: "Non puoi eliminare il tuo account." };

  const { count } = await prisma.user.deleteMany({
    where: { id: employeeId, companyId, isOwner: false },
  });
  if (count === 0) return { error: "Impossibile eliminare questo utente." };

  revalidateTeam();
  return { ok: true };
}

export async function setEmployeeRole(employeeId: string, role: "ADMIN" | "EMPLOYEE"): Promise<ActionState> {
  const { companyId, user } = await requireAdmin();
  if (employeeId === user.id) return { error: "Non puoi cambiare il tuo ruolo." };

  const result = await prisma.$transaction(
    async (tx) => {
      const target = await tx.user.findFirst({ where: { id: employeeId, companyId } });
      if (!target) return { error: "Dipendente non trovato." };
      if (target.isOwner) return { error: "Il fondatore dell'azienda resta sempre amministratore." };
      if (target.role === role) return { ok: true };

      if (role === "ADMIN") {
        const admins = await tx.user.count({ where: { companyId, role: "ADMIN" } });
        if (admins >= MAX_ADMINS) {
          return { error: `Puoi avere al massimo ${MAX_ADMINS} amministratori.` };
        }
      }
      await tx.user.updateMany({ where: { id: employeeId, companyId }, data: { role } });
      return { ok: true };
    },
    { isolationLevel: "Serializable" },
  );

  if (result.ok) revalidateTeam();
  return result;
}

export async function regenerateCode(employeeId: string): Promise<CodeResult> {
  const { companyId, user } = await requireAdmin();
  const target = await prisma.user.findFirst({
    where: { id: employeeId, companyId },
    select: { id: true, firstName: true, lastName: true },
  });
  if (!target) return { error: "Dipendente non trovato." };

  const personalCode = await retryOnUnique(async () => {
    const { code, codeHash } = newPersonalCode();
    await prisma.user.updateMany({ where: { id: target.id, companyId }, data: { codeHash } });
    return code;
  });
  // Il vecchio codice potrebbe essere in mano ad altri: chiude le sessioni aperte (tranne la propria).
  if (target.id !== user.id) await destroyUserSessions(target.id);

  return { ok: true, personalCode, name: `${target.firstName} ${target.lastName}` };
}
