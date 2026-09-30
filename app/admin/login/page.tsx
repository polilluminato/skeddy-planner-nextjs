import type { Metadata } from "next";
import { loginSuperAdmin } from "@/actions/auth";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { Logo } from "@/components/common/logo";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Super admin", robots: { index: false } };

export default async function SuperAdminLoginPage() {
  const session = await getSession();
  if (session?.isSuperAdmin) redirect("/admin");
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-md content-center gap-6 px-4 py-10">
      <Logo />
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Area tecnica</h1>
        <p className="text-muted-foreground">Accesso riservato al super amministratore (sola lettura).</p>
      </div>
      <EmailLoginForm action={loginSuperAdmin} />
    </main>
  );
}
