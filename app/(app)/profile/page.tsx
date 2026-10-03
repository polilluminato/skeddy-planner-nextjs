import type { Metadata } from "next";
import { LogOutIcon } from "lucide-react";
import { HoursSummary } from "@/components/calendar/hours-summary";
import type { CalendarMember } from "@/components/calendar/types";
import { CodeReveal } from "@/components/common/code-reveal";
import { MemberChip } from "@/components/common/member-chip";
import { AppHeader } from "@/components/nav/app-header";
import { LogoutButton } from "@/components/nav/logout-button";
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
      <AppHeader title="Profilo" subtitle={company.name}>
        <LogoutButton
          trigger={
            <Button variant="outline" size="icon" className="size-11" aria-label="Esci" title="Esci">
              <LogOutIcon className="size-5" aria-hidden />
            </Button>
          }
        />
      </AppHeader>
      <main className="mx-auto grid max-w-2xl gap-5 px-4 py-4 desktop:max-w-none desktop:px-8 desktop:py-6 desktop:lg:grid-cols-2 desktop:lg:items-start">
        <section aria-labelledby="me-title" className="grid gap-3 rounded-xl border bg-card p-4">
          <div className="grid min-w-0 justify-items-start gap-2">
            <h1 id="me-title" className="max-w-full text-xl font-semibold tracking-tight">
              <MemberChip name={`${user.firstName} ${user.lastName}`} color={user.color} />
            </h1>
            <MemberBadges role={user.role} isOwner={user.isOwner} />
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
      </main>
    </>
  );
}
