import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { HoursStatusText } from "@/components/calendar/hours-summary";
import { CodeReveal } from "@/components/common/code-reveal";
import { AppHeader } from "@/components/nav/app-header";
import { CreateEmployee } from "@/components/team/create-employee";
import { MemberBadges } from "@/components/team/member-badges";
import { APP_TIME_ZONE, MAX_ADMINS } from "@/config/app";
import { requireAdmin } from "@/lib/auth/guards";
import { addDays, startOfWeek, todayISO } from "@/lib/domain/dates";
import { hoursSummary } from "@/lib/domain/schedule";
import { formatMinutes } from "@/lib/domain/shifts";
import { getShifts, getTeam } from "@/lib/queries";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const { user, company, companyId } = await requireAdmin();
  const weekStart = startOfWeek(todayISO(APP_TIME_ZONE));
  const [team, shifts] = await Promise.all([
    getTeam(companyId),
    getShifts(companyId, weekStart, addDays(weekStart, 6)),
  ]);
  const rows = new Map(hoursSummary(team, shifts).map((r) => [r.userId, r]));
  const adminCount = team.filter((m) => m.role === "ADMIN").length;

  return (
    <>
      <AppHeader title="Team" subtitle={company.name} />
      <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4">
        <h1 className="sr-only">Team</h1>

        <section aria-labelledby="company-code" className="grid gap-3 rounded-xl border bg-card p-4">
          <h2 id="company-code" className="font-semibold">
            Accesso dei dipendenti
          </h2>
          <CodeReveal label="Codice azienda" value={company.code} />
          <p className="text-sm text-muted-foreground">
            Ogni persona entra con il codice azienda e il proprio codice personale.
          </p>
        </section>

        <CreateEmployee companyCode={company.code} />

        <section aria-labelledby="members-title" className="grid gap-2">
          <div className="flex items-baseline justify-between">
            <h2 id="members-title" className="font-semibold">
              Persone ({team.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Amministratori {adminCount}/{MAX_ADMINS}
            </p>
          </div>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card">
            {team.map((m) => {
              const row = rows.get(m.id)!;
              return (
                <li key={m.id}>
                  <Link
                    href={`/team/${m.id}`}
                    className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="size-3 shrink-0 rounded-full" style={{ background: m.color }} aria-hidden />
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate font-medium">
                        {m.firstName} {m.lastName}
                      </span>
                      <MemberBadges role={m.role} isOwner={m.isOwner} isMe={m.id === user.id} />
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm tabular-nums">
                          {formatMinutes(row.planned)}
                          {row.target > 0 && (
                            <span className="text-muted-foreground"> / {formatMinutes(row.target)}</span>
                          )}
                          <span className="text-muted-foreground"> questa settimana</span>
                        </span>
                        <HoursStatusText row={row} />
                      </span>
                    </span>
                    <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
