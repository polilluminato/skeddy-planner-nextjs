import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { HoursStatusText } from "@/components/calendar/hours-summary";
import { CodeReveal } from "@/components/common/code-reveal";
import { MemberChip } from "@/components/common/member-chip";
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
  const { meId, company, companyId } = await requireAdmin();
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
      <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4 desktop:max-w-none desktop:px-8 desktop:py-6">
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

        <section aria-labelledby="members-title" className="grid gap-2">
          <div className="grid gap-3 desktop:flex desktop:items-end desktop:justify-between">
            <div className="grid gap-0.5">
              <h2 id="members-title" className="font-semibold">
                Persone ({team.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Amministratori {adminCount}/{MAX_ADMINS}
              </p>
            </div>
            <CreateEmployee companyCode={company.code} />
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
                    <span className="grid min-w-0 flex-1 justify-items-start gap-1">
                      <MemberChip name={`${m.firstName} ${m.lastName}`} color={m.color} />
                      <MemberBadges role={m.role} isOwner={m.isOwner} isMe={m.id === meId} />
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
