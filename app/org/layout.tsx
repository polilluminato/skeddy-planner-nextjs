import { cookies } from "next/headers";
import { LogOutIcon } from "lucide-react";
import { LogoMark } from "@/components/common/logo";
import { AppNav } from "@/components/nav/app-nav";
import { LogoutButton } from "@/components/nav/logout-button";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { SIDEBAR_COOKIE } from "@/config/app";
import { requireSupervisor } from "@/lib/auth/guards";

/** Area dell'Amministrazione: scelta del negozio su cui operare, nuovi negozi, account. Solo vista desktop (uso da PC). */
export default async function OrganizationLayout({ children }: LayoutProps<"/org">) {
  const { session, organization } = await requireSupervisor();
  // Con un negozio attivo c'è la stessa sidebar dell'app; senza, le sue voci rimanderebbero qui.
  const active = organization.companies.find((c) => c.id === session.activeCompanyId);
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed";
  return (
    <div
      data-sidebar={active ? "" : undefined}
      className="min-h-dvh min-w-5xl desktop:pl-60 desktop:has-[nav[data-sidebar-collapsed]]:pl-16"
    >
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-8">
          {!active && <LogoMark className="size-7 shrink-0" />}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight">Amministrazione</p>
            <p className="truncate text-xs text-muted-foreground">{organization.name}</p>
          </div>
          <ThemeToggle />
          {/* Con la sidebar si esce da lì. */}
          {!active && (
            <LogoutButton
              trigger={
                <Button variant="outline" size="icon" className="size-11" aria-label="Esci" title="Esci">
                  <LogOutIcon className="size-5" aria-hidden />
                </Button>
              }
            />
          )}
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl grid-cols-[1fr_22rem] items-start gap-8 px-8 py-8">{children}</main>
      {active && (
        <AppNav
          isAdmin
          unread={0}
          defaultCollapsed={collapsed}
          activeTeam={{ id: active.id, name: active.name }}
          teams={organization.companies.map(({ id, name }) => ({ id, name }))}
        />
      )}
    </div>
  );
}
