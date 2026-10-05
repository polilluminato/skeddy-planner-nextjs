import { cookies } from "next/headers";
import { LogOutIcon } from "lucide-react";
import { AppHeader } from "@/components/nav/app-header";
import { AppNav } from "@/components/nav/app-nav";
import { LogoutButton } from "@/components/nav/logout-button";
import { Button } from "@/components/ui/button";
import { SIDEBAR_COOKIE } from "@/config/app";
import { requireSupervisor } from "@/lib/auth/guards";

/** Area dell'Amministrazione: scelta del negozio su cui operare, nuovi negozi, account. Solo vista desktop (uso da PC). */
export default async function OrganizationLayout({ children }: LayoutProps<"/org">) {
  const { session, organization } = await requireSupervisor();
  // Con un negozio attivo c'è la stessa sidebar dell'app; senza, le sue voci rimanderebbero qui.
  // `data-sidebar` sempre: /org è solo desktop, così la barra in alto è quella delle altre pagine.
  const active = organization.companies.find((c) => c.id === session.activeCompanyId);
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed";
  return (
    <div
      data-sidebar
      className={active ? "min-h-dvh min-w-5xl desktop:pl-60 desktop:has-[nav[data-sidebar-collapsed]]:pl-16" : "min-h-dvh min-w-5xl"}
    >
      <AppHeader title="Amministrazione" subtitle={organization.name}>
        {/* Con la sidebar si esce da lì. */}
        {!active && (
          <LogoutButton
            trigger={
              <Button variant="ghost" size="icon" className="size-11" aria-label="Esci" title="Esci">
                <LogOutIcon className="size-5" aria-hidden />
              </Button>
            }
          />
        )}
      </AppHeader>
      <main className="grid grid-cols-3 items-start gap-5 px-8 py-6">{children}</main>
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
