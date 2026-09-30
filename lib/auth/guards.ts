import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";

/** Utente di un'azienda (admin o dipendente). Il super admin viene mandato nella sua area. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.isSuperAdmin) redirect("/admin");
  if (!session.user) redirect("/login");
  const { user } = session;
  return { user, company: user.company, companyId: user.companyId, isAdmin: user.role === "ADMIN" };
}

export async function requireAdmin() {
  const ctx = await requireUser();
  if (!ctx.isAdmin) redirect("/calendar");
  return ctx;
}

export async function requireSuperAdmin() {
  const session = await getSession();
  if (!session?.isSuperAdmin) redirect("/admin/login");
  return session;
}

/** Per le pagine pubbliche: chi è già autenticato va nella sua area. */
export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session?.isSuperAdmin) redirect("/admin");
  if (session?.user) redirect("/calendar");
}
