import { LogOutIcon } from "lucide-react";
import { LogoMark } from "@/components/common/logo";
import { LogoutButton } from "@/components/nav/logout-button";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { requireSupervisor } from "@/lib/auth/guards";

/** Area dell'Amministrazione: scelta del negozio su cui operare, nuovi negozi, account. */
export default async function OrganizationLayout({ children }: LayoutProps<"/org">) {
  const { organization } = await requireSupervisor();
  return (
    <div className="min-h-dvh pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-30 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <LogoMark className="size-7 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight">Amministrazione</p>
            <p className="truncate text-xs text-muted-foreground">{organization.name}</p>
          </div>
          <ThemeToggle />
          <LogoutButton
            trigger={
              <Button variant="outline" size="icon" className="size-11" aria-label="Esci" title="Esci">
                <LogOutIcon className="size-5" aria-hidden />
              </Button>
            }
          />
        </div>
      </header>
      <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4">{children}</main>
    </div>
  );
}
