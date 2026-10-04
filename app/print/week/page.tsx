import type { Metadata } from "next";
import { MemberChip } from "@/components/common/member-chip";
import { PrintButton } from "@/components/common/print-button";
import { APP_TIME_ZONE } from "@/config/app";
import { requireAdmin } from "@/lib/auth/guards";
import { addDays, isISODate, startOfWeek, todayISO, weekDays } from "@/lib/domain/dates";
import { dayOfMonth, formatShortWeekday, formatWeekRange } from "@/lib/domain/format";
import { getShifts, getTeam } from "@/lib/queries";

export const metadata: Metadata = { title: "Stampa settimana" };

/** Settimana in tabella da stampare: righe = dipendenti, colonne = giorni. Fuori dal layout dell'app (niente nav). */
export default async function PrintWeekPage({ searchParams }: PageProps<"/print/week">) {
  const { company, companyId } = await requireAdmin();
  const { date } = await searchParams;
  const weekStart = startOfWeek(typeof date === "string" && isISODate(date) ? date : todayISO(APP_TIME_ZONE));
  const [team, shifts] = await Promise.all([getTeam(companyId), getShifts(companyId, weekStart, addDays(weekStart, 6))]);
  const days = weekDays(weekStart).filter((day) => shifts.some((s) => s.date === day));

  return (
    // Sempre chiaro: in stampa lo sfondo scuro non esce e il testo chiaro sparirebbe.
    // `--card` bianco anche col tema scuro: i chip dei dipendenti mescolano il colore con la card.
    <main className="min-h-dvh bg-white p-6 text-black print:p-0" style={{ "--card": "#ffffff" } as React.CSSProperties}>
      <style>{"@page { size: A4 landscape; margin: 1cm; }"}</style>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-600">{company.name}</p>
          <h1 className="text-xl font-semibold">Turni · {formatWeekRange(weekStart)}</h1>
        </div>
        <PrintButton />
      </div>
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="w-36 border border-neutral-400 p-2 text-left">
              Dipendente
            </th>
            {days.map((day) => (
              <th key={day} scope="col" className="border border-neutral-400 p-2 text-left capitalize">
                {formatShortWeekday(day)} {dayOfMonth(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {team.map((m) => {
            const own = shifts.filter((s) => s.userId === m.id);
            return (
              <tr key={m.id} className="break-inside-avoid">
                <th scope="row" className="border border-neutral-400 p-2 text-left align-top font-medium">
                  <MemberChip name={m.lastName ? `${m.firstName} ${m.lastName[0]}.` : m.firstName} color={m.color} />
                </th>
                {days.map((day) => {
                  const dayShifts = own.filter((s) => s.date === day);
                  return (
                    <td key={day} className="relative border border-neutral-400 p-2 align-top">
                      {dayShifts.length === 0 ? (
                        // SVG e non sfondo CSS: i browser non stampano gli sfondi di default.
                        <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 1 1">
                          <path d="M0 0L1 1M1 0L0 1" stroke="#a3a3a3" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        </svg>
                      ) : (
                        dayShifts.map((s) => (
                          <p key={s.id} className="tabular-nums">
                            {s.start}–{s.end}
                            {s.note && <span className="block text-xs text-neutral-600">{s.note}</span>}
                          </p>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
