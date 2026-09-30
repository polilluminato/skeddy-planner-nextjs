import type { Metadata } from "next";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/actions/auth";
import { HoursSummary } from "@/components/calendar/hours-summary";
import type { CalendarMember } from "@/components/calendar/types";
import { CodeReveal } from "@/components/common/code-reveal";
import { AppHeader } from "@/components/nav/app-header";
import { ChangePasswordForm } from "@/components/profile/change-password";
import { MemberBadges } from "@/components/team/member-badges";
import { Button } from "@/components/ui/button";
import { APP_TIME_ZONE } from "@/config/app";
import { requireUser } from "@/lib/auth/guards";
import { addDays, startOfWeek, todayISO } from "@/lib/domain/dates";
import { formatWeekRange } from "@/lib/domain/format";
import { hoursSummary } from "@/lib/domain/schedule";
import { getShifts } from "@/lib/queries";

export const metadata: Metadata = { title: "Profilo" };

export default async function ProfilePage() {
  const { user, company, companyId } = await requireUser();
  const weekStart = startOfWeek(todayISO(APP_TIME_ZONE));
  const shifts = await getShifts(companyId, weekStart, addDays(weekStart, 6), user.id);
  const members = new Map<string, CalendarMember>([[user.id, user]]);

  return (
    <>
      <AppHeader title="Profilo" subtitle={company.name} />
      <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4">
        <section aria-labelledby="me-title" className="grid gap-3 rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 size-4 shrink-0 rounded-full" style={{ background: user.color }} aria-hidden />
            <div className="grid gap-1">
              <h1 id="me-title" className="text-xl font-semibold tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <MemberBadges role={user.role} isOwner={user.isOwner} />
            </div>
          </div>
          <dl className="grid gap-3 border-t pt-3">
            <div>
              <dt className="text-xs text-muted-foreground">Azienda</dt>
              <dd className="font-medium">{company.name}</dd>
            </div>
            {user.email && (
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
            )}
          </dl>
          <CodeReveal label="Codice azienda" value={company.code} />
        </section>

        <HoursSummary
          rows={hoursSummary([user], shifts)}
          members={members}
          title={`Le mie ore · ${formatWeekRange(weekStart)}`}
        />

        {user.passwordHash && (
          <section aria-labelledby="password-title" className="grid gap-3 rounded-xl border bg-card p-4">
            <h2 id="password-title" className="font-semibold">
              Password
            </h2>
            <ChangePasswordForm />
          </section>
        )}

        <form action={logout}>
          <Button type="submit" variant="ghost" className="h-11 w-full text-base text-destructive">
            <LogOutIcon aria-hidden />
            Esci
          </Button>
        </form>
      </main>
    </>
  );
}
