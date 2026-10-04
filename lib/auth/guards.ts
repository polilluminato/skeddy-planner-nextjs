import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";

/**
 * Chi opera su un'azienda: admin o dipendente, oppure l'Amministrazione (organizzazione)
 * sul team attivo della sessione, con poteri da admin e `user`/`meId` null perché non è un membro.
 * Il super admin viene mandato nella sua area.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.isSuperAdmin) redirect("/admin");
  const { organization } = session;
  if (organization) {
    // Il team attivo vale solo se appartiene all'organizzazione: è il controllo di tenant.
    const company = organization.companies.find((c) => c.id === session.activeCompanyId);
    if (!company) redirect("/org");
    return { user: null, meId: null, organization, company, companyId: company.id, isAdmin: true, isSupervisor: true };
  }
  if (!session.user) redirect("/login");
  const { user } = session;
  return {
    user,
    meId: user.id,
    organization: null,
    company: user.company,
    companyId: user.companyId,
    isAdmin: user.role === "ADMIN",
    isSupervisor: false,
  };
}

export async function requireAdmin() {
  const ctx = await requireUser();
  if (!ctx.isAdmin) redirect("/calendar");
  return ctx;
}

/** Area dell'Amministrazione (`/org`): scelta e creazione dei team. */
export async function requireSupervisor() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.organization) redirect(session.isSuperAdmin ? "/admin" : "/calendar");
  return { session, organization: session.organization };
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
  if (session?.user || session?.organization) redirect("/calendar");
}
