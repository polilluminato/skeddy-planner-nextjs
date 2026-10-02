import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DaySection } from "@/components/calendar/day-list";
import { HoursSummary } from "@/components/calendar/hours-summary";
import { ShiftEditorProvider } from "@/components/calendar/shift-editor";
import type { CalendarMember } from "@/components/calendar/types";
import { AppHeader } from "@/components/nav/app-header";
import { Button } from "@/components/ui/button";
import { EditEmployee } from "@/components/team/edit-employee";
import { DeleteMember, RoleAction } from "@/components/team/member-actions";
import { MemberBadges } from "@/components/team/member-badges";
import { RegenerateCode } from "@/components/team/regenerate-code";
import { APP_TIME_ZONE, MAX_ADMINS } from "@/config/app";
import { requireAdmin } from "@/lib/auth/guards";
import { addDays, isISODate, startOfWeek, todayISO, weekDays } from "@/lib/domain/dates";
import { formatLongDay, formatWeekRange } from "@/lib/domain/format";
import { groupByDate, hoursSummary } from "@/lib/domain/schedule";
import { formatMinutes } from "@/lib/domain/shifts";
import { getShifts, getTeam } from "@/lib/queries";

export const metadata: Metadata = { title: "Dipendente" };

export default async function MemberPage({ params, searchParams }: PageProps<"/team/[id]">) {
  const { user, company, companyId } = await requireAdmin();
  const { id } = await params;
  const { week } = await searchParams;
  const today = todayISO(APP_TIME_ZONE);
  const weekStart = startOfWeek(typeof week === "string" && isISODate(week) ? week : today);

  const team = await getTeam(companyId);
  const member = team.find((m) => m.id === id);
  if (!member) notFound();

  const shifts = await getShifts(companyId, weekStart, addDays(weekStart, 6), member.id);
  const byDate = groupByDate(shifts);
  const members = new Map<string, CalendarMember>([[member.id, member]]);
  const name = `${member.firstName} ${member.lastName}`;
  const isMe = member.id === user.id;
  const adminCount = team.filter((m) => m.role === "ADMIN").length;
  const weekHref = (d: string) => `/team/${member.id}?week=${d}`;

  return (
    <>
      <AppHeader title={name} subtitle={company.name} />
      <ShiftEditorProvider members={team}>
        <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4 desktop:max-w-none desktop:px-8 desktop:py-6 desktop:lg:grid-cols-3 desktop:lg:items-start">
          <Link
            href="/team"
            className="-ml-1 flex h-11 w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground desktop:lg:col-span-3"
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
            Team
          </Link>

          <section
            aria-labelledby="member-title"
            className="grid gap-4 rounded-xl border bg-card p-4 desktop:lg:col-start-1"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1.5 size-4 shrink-0 rounded-full" style={{ background: member.color }} aria-hidden />
              <div className="grid min-w-0 flex-1 gap-1">
                <h1 id="member-title" className="text-xl font-semibold tracking-tight">
                  {name}
                </h1>
                <MemberBadges role={member.role} isOwner={member.isOwner} isMe={isMe} />
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <dt className="text-xs text-muted-foreground">Ore settimanali previste</dt>
                <dd className="font-semibold tabular-nums">
                  {member.weeklyMinutes > 0 ? formatMinutes(member.weeklyMinutes) : "Non impostate"}
                </dd>
              </div>
              {member.email && (
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="truncate font-medium">{member.email}</dd>
                </div>
              )}
            </dl>
            <div className="flex gap-2">
              <EditEmployee
                employeeId={member.id}
                defaults={{
                  firstName: member.firstName,
                  lastName: member.lastName,
                  weeklyMinutes: member.weeklyMinutes,
                  color: member.color,
                }}
              />
            </div>
          </section>

          <section
            aria-labelledby="week-title"
            className="grid gap-3 desktop:lg:col-span-2 desktop:lg:col-start-2 desktop:lg:row-span-2 desktop:lg:row-start-2"
          >
            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon" className="size-11">
                <Link href={weekHref(addDays(weekStart, -7))} aria-label="Settimana precedente">
                  <ChevronLeftIcon className="size-5" aria-hidden />
                </Link>
              </Button>
              <h2 id="week-title" className="flex-1 text-center font-semibold">
                {formatWeekRange(weekStart)}
              </h2>
              <Button asChild variant="ghost" size="icon" className="size-11">
                <Link href={weekHref(addDays(weekStart, 7))} aria-label="Settimana successiva">
                  <ChevronRightIcon className="size-5" aria-hidden />
                </Link>
              </Button>
            </div>
            <HoursSummary rows={hoursSummary([member], shifts)} members={members} title="Ore pianificate" />
            <div className="grid gap-3 desktop:grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]">
              {weekDays(weekStart).map((day) => (
                <DaySection
                  key={day}
                  date={day}
                  title={formatLongDay(day)}
                  isToday={day === today}
                  shifts={byDate.get(day) ?? []}
                  members={members}
                  currentUserId={user.id}
                  canEdit
                  defaultUserId={member.id}
                />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="actions-title"
            className="grid gap-2 rounded-xl border bg-card p-4 desktop:lg:col-start-1"
          >
            <h2 id="actions-title" className="mb-1 font-semibold">
              Accesso e permessi
            </h2>
            <RegenerateCode employeeId={member.id} name={name} />
            {!member.isOwner && !isMe && (
              <>
                <RoleAction
                  employeeId={member.id}
                  name={name}
                  role={member.role}
                  canPromote={adminCount < MAX_ADMINS}
                />
                <DeleteMember employeeId={member.id} name={name} />
              </>
            )}
            {member.isOwner && (
              <p className="text-sm text-muted-foreground">
                Il fondatore resta sempre amministratore e non può essere eliminato.
              </p>
            )}
          </section>
        </main>
      </ShiftEditorProvider>
    </>
  );
}
