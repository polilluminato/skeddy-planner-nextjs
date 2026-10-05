import { LogOutIcon } from "lucide-react";
import { LogoMark } from "@/components/common/logo";
import { LogoutButton } from "@/components/nav/logout-button";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { requireSupervisor } from "@/lib/auth/guards";

/** Area dell'Amministrazione: scelta del negozio su cui operare, nuovi negozi, account. Solo vista desktop (uso da PC). */
export default async function OrganizationLayout({ children }: LayoutProps<"/org">) {
  const { organization } = await requireSupervisor();
  return (
    <div className="min-h-dvh min-w-5xl">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-8">
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
      <main className="mx-auto grid max-w-6xl grid-cols-[1fr_22rem] items-start gap-8 px-8 py-8">{children}</main>
    </div>
  );
}
