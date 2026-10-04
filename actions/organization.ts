"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { firstError, type ActionState } from "@/lib/action-state";
import { generateCompanyCode } from "@/lib/auth/crypto";
import { requireSupervisor } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { retryOnUnique } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, createCompanySchema, renameOrganizationSchema } from "@/lib/validation/auth";

/** Sceglie il negozio su cui opera l'Amministrazione (team attivo della sessione). */
export async function selectCompany(companyId: string): Promise<void> {
  const { session, organization } = await requireSupervisor();
  if (!organization.companies.some((c) => c.id === companyId)) redirect("/org");
  await prisma.session.update({ where: { id: session.id }, data: { activeCompanyId: companyId } });
  redirect("/calendar");
}

export async function createCompany(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { organization } = await requireSupervisor();
  const parsed = createCompanySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  await retryOnUnique(() =>
    prisma.company.create({
      data: { organizationId: organization.id, name: parsed.data.companyName, code: generateCompanyCode() },
    }),
  );
  revalidatePath("/org");
  return { ok: true };
}

/** Il nome del negozio compare in tutte le pagine dell'app: si rivalida tutto il layout. */
function revalidateNames() {
  revalidatePath("/", "layout");
}

export async function renameOrganization(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { organization } = await requireSupervisor();
  const parsed = renameOrganizationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  await prisma.organization.update({ where: { id: organization.id }, data: { name: parsed.data.organizationName } });
  revalidateNames();
  return { ok: true };
}

export async function renameCompany(companyId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { organization } = await requireSupervisor();
  const parsed = createCompanySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const { count } = await prisma.company.updateMany({
    where: { id: companyId, organizationId: organization.id },
    data: { name: parsed.data.companyName },
  });
  if (count === 0) return { error: "Negozio non trovato." };
  revalidateNames();
  return { ok: true };
}

export async function changeOrganizationPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { organization } = await requireSupervisor();
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  if (!(await verifyPassword(parsed.data.currentPassword, organization.passwordHash))) {
    return { error: "La password attuale non è corretta." };
  }
  await prisma.organization.update({
    where: { id: organization.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  return { ok: true };
}
