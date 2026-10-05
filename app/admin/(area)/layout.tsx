import { LogOutIcon } from "lucide-react";
import { logoutSuperAdmin } from "@/actions/auth";
import { AppHeader } from "@/components/nav/app-header";
import { Button } from "@/components/ui/button";
import { requireSuperAdmin } from "@/lib/auth/guards";

export default async function SuperAdminLayout({ children }: LayoutProps<"/admin">) {
  await requireSuperAdmin();
  return (
    <div className="min-h-dvh pb-[env(safe-area-inset-bottom)]">
      <AppHeader title="Super admin">
        <form action={logoutSuperAdmin}>
          <Button type="submit" variant="ghost" size="icon" className="size-11" aria-label="Esci">
            <LogOutIcon className="size-5" aria-hidden />
          </Button>
        </form>
      </AppHeader>
      <main className="mx-auto grid max-w-2xl gap-4 px-4 py-4">{children}</main>
    </div>
  );
}
