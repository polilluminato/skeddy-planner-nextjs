import type { Metadata } from "next";
import { ChevronRightIcon } from "lucide-react";
import { changeOrganizationPassword, renameOrganization, selectCompany } from "@/actions/organization";
import { CreateCompanyForm } from "@/components/org/create-company";
import { RenameCompany } from "@/components/org/rename-company";
import { RenameForm } from "@/components/org/rename-form";
import { ChangePasswordForm } from "@/components/profile/change-password";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_TIME_ZONE } from "@/config/app";
import { requireSupervisor } from "@/lib/auth/guards";
import { addDays, startOfWeek, todayISO } from "@/lib/domain/dates";
import { formatWeekRange } from "@/lib/domain/format";
import { hoursSummary } from "@/lib/domain/schedule";
import { formatMinutes } from "@/lib/domain/shifts";
import { getOrganizationOverview } from "@/lib/queries";

export const metadata: Metadata = { title: "Negozi" };

export default async function OrganizationPage() {
  const { session, organization } = await requireSupervisor();
  const weekStart = startOfWeek(todayISO(APP_TIME_ZONE));
  const companies = await getOrganizationOverview(organization.id, weekStart, addDays(weekStart, 6));

  return (
    <>
      <section aria-labelledby="teams-title" className="grid gap-4">
        <div className="grid gap-1">
          <h1 id="teams-title" className="text-2xl font-semibold tracking-tight">
            Negozi
          </h1>
          <p className="text-sm text-muted-foreground">
            Scegli il negozio su cui lavorare · ore della settimana {formatWeekRange(weekStart)}
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Negozio</th>
                <th scope="col" className="px-4 py-3 font-medium">Codice azienda</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Persone</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Ore settimana</th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Azioni</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {companies.map((c) => {
                const rows = hoursSummary(c.users, c.shifts);
                const planned = rows.reduce((sum, r) => sum + r.planned, 0);
                const target = rows.reduce((sum, r) => sum + r.target, 0);
                const active = c.id === session.activeCompanyId;
                return (
                  <tr key={c.id} aria-current={active ? "true" : undefined} className="hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {active && <Badge variant="secondary">Attivo</Badge>}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.code}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.users.length}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatMinutes(planned)}
                      {target > 0 && <span className="text-muted-foreground"> / {formatMinutes(target)}</span>}
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-end gap-1">
                        <RenameCompany companyId={c.id} name={c.name} />
                        <form action={selectCompany.bind(null, c.id)}>
                          <Button type="submit" variant={active ? "default" : "outline"}>
                            Apri
                            <ChevronRightIcon aria-hidden />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="grid gap-5">
        <section aria-labelledby="new-team-title" className="grid gap-3 rounded-xl border bg-card p-4">
          <h2 id="new-team-title" className="font-semibold">
            Nuovo negozio
          </h2>
          <CreateCompanyForm />
        </section>

        <section aria-labelledby="account-title" className="grid gap-3 rounded-xl border bg-card p-4">
          <div className="grid gap-0.5">
            <h2 id="account-title" className="font-semibold">
              Account
            </h2>
            <p className="truncate text-sm text-muted-foreground">{organization.email}</p>
          </div>
          <RenameForm
            key={organization.name}
            label="Nome dell'organizzazione"
            name="organizationName"
            defaultValue={organization.name}
            action={renameOrganization}
          />
          <div className="border-t pt-3">
            <ChangePasswordForm action={changeOrganizationPassword} />
          </div>
        </section>
      </aside>
    </>
  );
}
