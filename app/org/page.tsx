import type { Metadata } from "next";
import { ChevronRightIcon } from "lucide-react";
import { changeOrganizationPassword, renameOrganization, selectCompany } from "@/actions/organization";
import { CreateCompanyForm } from "@/components/org/create-company";
import { RenameCompany } from "@/components/org/rename-company";
import { RenameForm } from "@/components/org/rename-form";
import { ChangePasswordForm } from "@/components/profile/change-password";
import { Badge } from "@/components/ui/badge";
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
      <section aria-labelledby="teams-title" className="grid gap-2">
        <div className="grid gap-1">
          <h1 id="teams-title" className="text-2xl font-semibold tracking-tight">
            Negozi
          </h1>
          <p className="text-sm text-muted-foreground">
            Scegli il negozio su cui lavorare · ore della settimana {formatWeekRange(weekStart)}
          </p>
        </div>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {companies.map((c) => {
            const rows = hoursSummary(c.users, c.shifts);
            const planned = rows.reduce((sum, r) => sum + r.planned, 0);
            const target = rows.reduce((sum, r) => sum + r.target, 0);
            const active = c.id === session.activeCompanyId;
            return (
              <li key={c.id} className="flex items-center pr-2">
                <form action={selectCompany.bind(null, c.id)} className="min-w-0 flex-1">
                  <button
                    type="submit"
                    aria-current={active ? "true" : undefined}
                    className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">{c.name}</span>
                        {active && <Badge variant="secondary">Attivo</Badge>}
                      </span>
                      <span className="truncate font-mono text-xs text-muted-foreground">{c.code}</span>
                      <span className="text-sm tabular-nums">
                        {c.users.length} {c.users.length === 1 ? "persona" : "persone"} · {formatMinutes(planned)}
                        {target > 0 && <span className="text-muted-foreground"> / {formatMinutes(target)}</span>}
                      </span>
                    </span>
                    <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                </form>
                <RenameCompany companyId={c.id} name={c.name} />
              </li>
            );
          })}
        </ul>
      </section>

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
          <p className="text-sm text-muted-foreground">{organization.email}</p>
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
    </>
  );
}
