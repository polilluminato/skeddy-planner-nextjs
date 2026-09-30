import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { HoursSummary } from "@/components/calendar/hours-summary";
import type { CalendarMember } from "@/components/calendar/types";
import { MemberBadges } from "@/components/team/member-badges";
import { APP_TIME_ZONE } from "@/config/app";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { addDays, startOfWeek, todayISO } from "@/lib/domain/dates";
import { formatWeekRange } from "@/lib/domain/format";
import { hoursSummary } from "@/lib/domain/schedule";
import { getCompanyForSuperAdmin, getShifts } from "@/lib/queries";

export const metadata: Metadata = { title: "Azienda" };

export default async function SuperAdminCompany({ params }: PageProps<"/admin/companies/[id]">) {
  await requireSuperAdmin();
  const { id } = await params;
  const company = await getCompanyForSuperAdmin(id);
  if (!company) notFound();

  const weekStart = startOfWeek(todayISO(APP_TIME_ZONE));
  const shifts = await getShifts(company.id, weekStart, addDays(weekStart, 6));
  const members = new Map<string, CalendarMember>(company.users.map((u) => [u.id, u]));

  return (
    <>
      <Link
        href="/admin"
        className="-ml-1 flex h-11 w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
        Aziende
      </Link>
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold tracking-tight">{company.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">{company.code}</p>
      </div>

      <section aria-labelledby="people-title" className="grid gap-2">
        <h2 id="people-title" className="font-semibold">
          Persone ({company.users.length})
        </h2>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {company.users.map((u) => (
            <li key={u.id} className="flex min-h-14 items-center gap-3 px-4 py-3">
              <span className="size-3 shrink-0 rounded-full" style={{ background: u.color }} aria-hidden />
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate font-medium">
                  {u.firstName} {u.lastName}
                </span>
                {u.email && <span className="truncate text-xs text-muted-foreground">{u.email}</span>}
              </span>
              <MemberBadges role={u.role} isOwner={u.isOwner} />
            </li>
          ))}
        </ul>
      </section>

      <HoursSummary
        rows={hoursSummary(company.users, shifts)}
        members={members}
        title={`Ore della settimana · ${formatWeekRange(weekStart)}`}
      />
    </>
  );
}
