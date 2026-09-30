import { LogOutIcon } from "lucide-react";
import { logoutSuperAdmin } from "@/actions/auth";
import { LogoMark } from "@/components/common/logo";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { requireSuperAdmin } from "@/lib/auth/guards";

export default async function SuperAdminLayout({ children }: LayoutProps<"/admin">) {
  await requireSuperAdmin();
  return (
    <div className="min-h-dvh pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-30 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <LogoMark className="size-7" />
          <p className="flex-1 font-semibold">Super admin</p>
          <ThemeToggle />
          <form action={logoutSuperAdmin}>
            <Button type="submit" variant="ghost" size="icon" className="size-11" aria-label="Esci">
              <LogOutIcon className="size-5" aria-hidden />
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto grid max-w-2xl gap-4 px-4 py-4">{children}</main>
    </div>
  );
}
