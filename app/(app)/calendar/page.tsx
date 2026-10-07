import type { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import { AddShiftButton } from "@/components/calendar/add-shift-button";
import { DaySection } from "@/components/calendar/day-list";
import { HoursSummary } from "@/components/calendar/hours-summary";
import { ShiftEditorProvider } from "@/components/calendar/shift-editor";
import { CalendarToolbar } from "@/components/calendar/toolbar";
import type { CalendarMember } from "@/components/calendar/types";
import { TeamHours } from "@/components/calendar/team-hours";
import { TimeGrid } from "@/components/calendar/time-grid";
import { Button } from "@/components/ui/button";
import { WeekView } from "@/components/calendar/week-view";
import { AppHeader } from "@/components/nav/app-header";
import { APP_TIME_ZONE } from "@/config/app";
import { requireUser } from "@/lib/auth/guards";
import { calendarHref, parseCalendarState, visibleRange } from "@/lib/domain/calendar";
import { addDays, startOfWeek, todayISO, weekDays } from "@/lib/domain/dates";
import { formatClock, formatLongDay, formatMonthYear, formatWeekRange } from "@/lib/domain/format";
import { groupByDate, hoursSummary } from "@/lib/domain/schedule";
import { timeToMinutes } from "@/lib/domain/shifts";
import { visibleHours } from "@/lib/domain/time-grid";
import { getShifts, getTeam } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Calendario" };

export default async function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  const { meId, isSupervisor, company, companyId, isAdmin } = await requireUser();
  const params = await searchParams;
  const today = todayISO(APP_TIME_ZONE);
  const state = parseCalendarState(params, today);
  // L'Amministrazione non ha turni suoi: niente filtro "Solo i miei".
  const onlyMine = !isSupervisor && params.mine === "1";
  const extraParams = onlyMine ? "&mine=1" : "";

  const range = visibleRange(state);
  // Le card del team (desktop) contano le ore della settimana della data scelta, anche nelle viste giorno e mese.
  const week = { from: startOfWeek(state.date), to: addDays(startOfWeek(state.date), 6) };
  const [team, loadedShifts] = await Promise.all([
    getTeam(companyId),
    getShifts(companyId, range.from < week.from ? range.from : week.from, range.to > week.to ? range.to : week.to),
  ]);
  const inRange = (from: string, to: string) => loadedShifts.filter((s) => s.date >= from && s.date <= to);
  const allShifts = inRange(range.from, range.to);

  const members = new Map<string, CalendarMember>(team.map((m) => [m.id, m]));
  const shifts = onlyMine ? allShifts.filter((s) => s.userId === meId) : allShifts;
  const byDate = groupByDate(shifts);
  const listProps = { members, currentUserId: meId, canEdit: isAdmin };

  // Riepilogo ore: gli admin vedono tutti, un dipendente solo sé stesso.
  const summaryMembers = isAdmin && !onlyMine ? team : team.filter((m) => m.id === meId);
  const summary = state.view === "week" ? hoursSummary(summaryMembers, allShifts) : [];

  const filterHref = (mine: boolean) => calendarHref(state) + (mine ? "&mine=1" : "");

  // Vista desktop degli admin: card ore del team + griglia oraria per giorno e settimana.
  const gridDays = state.view === "week" ? weekDays(state.date) : [state.date];
  const timeGrid = isAdmin && (
    <TimeGrid
      days={gridDays}
      today={today}
      hours={visibleHours(shifts)}
      shifts={shifts}
      members={team.map(({ id, firstName, lastName, color }) => ({ id, firstName, lastName, color }))}
      currentUserId={meId}
      canEdit
      nowMinutes={timeToMinutes(formatClock(new Date()))}
      extraParams={extraParams}
    />
  );

  const exportActions = isAdmin && (
    <>
      <Button asChild variant="outline" className="h-11">
        <a
          href={`/calendar/export?month=${state.date.slice(0, 7)}`}
          download
          title={`Scarica i turni di ${formatMonthYear(state.date)} in CSV`}
        >
          <DownloadIcon aria-hidden />
          CSV
        </a>
      </Button>
      <Button asChild variant="outline" className="h-11">
        <a href={`/print/week?date=${state.date}`} target="_blank" title="Stampa la settimana">
          <PrinterIcon aria-hidden />
          Stampa
        </a>
      </Button>
    </>
  );

  const content = (
    <main className="mx-auto grid max-w-2xl gap-4 px-4 py-4 desktop:max-w-none desktop:px-8 desktop:py-6">
      <h1 className="sr-only">Calendario turni</h1>
      {isAdmin && (
        <TeamHours
          rows={hoursSummary(team, inRange(week.from, week.to))}
          members={members}
          title={`Ore assegnate · ${formatWeekRange(week.from)}`}
          actions={<div className="flex gap-2">{exportActions}</div>}
          className="hidden desktop:block"
        />
      )}
      {/* Su mobile le card delle ore sono nascoste: le azioni vanno sopra le tab. */}
      {exportActions && <div className="grid grid-cols-2 gap-2 desktop:hidden">{exportActions}</div>}
      <div className="grid gap-4 desktop:flex desktop:items-center desktop:gap-6">
        <div className="desktop:flex-1">
          <CalendarToolbar state={state} today={today} extraParams={extraParams} />
        </div>

        {!isSupervisor && (
          <nav aria-label="Filtro turni" className="flex gap-2">
            {[
              { mine: false, label: "Tutti" },
              { mine: true, label: "Solo i miei" },
            ].map(({ mine, label }) => (
              <Link
                key={label}
                href={filterHref(mine)}
                aria-current={onlyMine === mine ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  onlyMine === mine
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {timeGrid && <div className="hidden desktop:block">{timeGrid}</div>}
      {/* Su mobile (e per i dipendenti) giorno e settimana restano a elenco. */}
      <div className={cn("grid gap-4", timeGrid && "desktop:hidden")}>
        {state.view === "week" && <WeekView date={state.date} today={today} byDate={byDate} {...listProps} />}
        {state.view === "day" && (
          <DaySection
            date={state.date}
            title={formatLongDay(state.date)}
            isToday={state.date === today}
            shifts={byDate.get(state.date) ?? []}
            {...listProps}
          />
        )}

        {summary.length > 0 && <HoursSummary rows={summary} members={members} />}
      </div>

      {isAdmin && <AddShiftButton date={state.date} variant="fab" />}
      {isAdmin && <div className="h-16" aria-hidden />}
    </main>
  );

  return (
    <>
      <AppHeader title="Calendario" subtitle={company.name} />
      {isAdmin ? <ShiftEditorProvider members={team}>{content}</ShiftEditorProvider> : content}
    </>
  );
}
