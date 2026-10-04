"use server";

import { redirect } from "next/navigation";
import { colorForIndex } from "@/config/colors";
import { firstError, type ActionState } from "@/lib/action-state";
import { newPersonalCode, hashPersonalCode } from "@/lib/auth/codes";
import { generateCompanyCode } from "@/lib/auth/crypto";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearAttempts, lockMessage, registerFailure } from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import { checkSuperAdmin } from "@/lib/auth/superadmin";
import { retryOnUnique } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import { codeLoginSchema, emailLoginSchema, organizationSignupSchema, signupSchema } from "@/lib/validation/auth";

/** Le email di accesso sono uniche tra utenti e organizzazioni: il login le cerca in entrambe. */
async function emailTaken(email: string) {
  const [user, organization] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    prisma.organization.findUnique({ where: { email }, select: { id: true } }),
  ]);
  return Boolean(user || organization);
}

export type SignupResult = ActionState<{ companyCode: string; personalCode: string }>;

export async function signup(_prev: SignupResult, formData: FormData): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { companyName, firstName, lastName, email, password } = parsed.data;

  if (await emailTaken(email)) return { error: "Esiste già un account con questa email." };

  const passwordHash = await hashPassword(password);
  try {
    const { user, companyCode, personalCode } = await retryOnUnique(async () => {
      const companyCode = generateCompanyCode();
      const { code: personalCode, codeHash } = newPersonalCode();
      const company = await prisma.company.create({
        data: {
          name: companyName,
          code: companyCode,
          users: {
            create: {
              firstName,
              lastName,
              email,
              passwordHash,
              codeHash,
              role: "ADMIN",
              isOwner: true,
              color: colorForIndex(0),
            },
          },
        },
        include: { users: true },
      });
      return { user: company.users[0], companyCode, personalCode };
    });
    await createSession({ userId: user.id });
    return { ok: true, companyCode, personalCode };
  } catch (error) {
    console.error("signup failed", error);
    return { error: "Registrazione non riuscita. Riprova." };
  }
}

export async function signupOrganization(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = organizationSignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { organizationName, companyName, email, password } = parsed.data;

  if (await emailTaken(email)) return { error: "Esiste già un account con questa email." };

  const passwordHash = await hashPassword(password);
  let target: { organizationId: string; activeCompanyId: string };
  try {
    target = await retryOnUnique(async () => {
      const org = await prisma.organization.create({
        data: { name: organizationName, email, passwordHash, companies: { create: { name: companyName, code: generateCompanyCode() } } },
        select: { id: true, companies: { select: { id: true } } },
      });
      return { organizationId: org.id, activeCompanyId: org.companies[0].id };
    });
  } catch (error) {
    console.error("organization signup failed", error);
    return { error: "Registrazione non riuscita. Riprova." };
  }
  await createSession(target);
  // Il primo negozio è vuoto: si parte creando le persone (e il primo amministratore).
  redirect("/team");
}

export async function loginWithCodes(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = codeLoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { companyCode, personalCode } = parsed.data;

  const key = `code:${companyCode}`;
  const locked = await lockMessage(key);
  if (locked) return { error: locked };

  const user = await prisma.user.findFirst({
    where: { codeHash: hashPersonalCode(personalCode), company: { code: companyCode } },
    select: { id: true },
  });
  if (!user) {
    await registerFailure(key);
    return { error: "Codice azienda o codice personale non corretti." };
  }

  await clearAttempts(key);
  await createSession({ userId: user.id });
  redirect("/calendar");
}

// Hash fittizio: confronto bcrypt anche quando l'email non esiste, per non rivelarlo dai tempi.
const DUMMY_HASH = "$2b$12$O76se0Rvf4wyR0opiR0UceKJqWP.riFXk1VxFC7q2GxsR0Y1nK5y6";

export async function loginWithEmail(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailLoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  const { email, password } = parsed.data;

  const key = `email:${email}`;
  const locked = await lockMessage(key);
  if (locked) return { error: locked };

  const [user, organization] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true, passwordHash: true } }),
    prisma.organization.findUnique({ where: { email }, select: { id: true, passwordHash: true } }),
  ]);
  const passwordHash = user?.passwordHash ?? organization?.passwordHash;
  const valid = await verifyPassword(password, passwordHash ?? DUMMY_HASH);
  if (!passwordHash || !valid) {
    await registerFailure(key);
    return { error: "Email o password non corrette." };
  }

  await clearAttempts(key);
  if (user) {
    await createSession({ userId: user.id });
    redirect("/calendar");
  }
  await createSession({ organizationId: organization!.id });
  redirect("/org");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function loginSuperAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailLoginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const key = "superadmin";
  const locked = await lockMessage(key);
  if (locked) return { error: locked };

  if (!checkSuperAdmin(parsed.data.email, parsed.data.password)) {
    await registerFailure(key);
    return { error: "Credenziali non corrette." };
  }

  await clearAttempts(key);
  await createSession({ superAdmin: true });
  redirect("/admin");
}

export async function logoutSuperAdmin(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
