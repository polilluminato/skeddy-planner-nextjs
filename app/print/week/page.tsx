import type { Metadata } from "next";
import { MemberChip } from "@/components/common/member-chip";
import { PrintButton } from "@/components/common/print-button";
import { APP_TIME_ZONE } from "@/config/app";
import { requireAdmin } from "@/lib/auth/guards";
import { addDays, isISODate, startOfWeek, todayISO, weekDays } from "@/lib/domain/dates";
import { dayOfMonth, formatShortWeekday, formatWeekRange } from "@/lib/domain/format";
import { formatMinutes, shiftMinutes } from "@/lib/domain/shifts";
import { getShifts, getTeam } from "@/lib/queries";

export const metadata: Metadata = { title: "Stampa settimana" };

/** Settimana in tabella da stampare: righe = dipendenti, colonne = giorni. Fuori dal layout dell'app (niente nav). */
export default async function PrintWeekPage({ searchParams }: PageProps<"/print/week">) {
  const { company, companyId } = await requireAdmin();
  const { date } = await searchParams;
  const weekStart = startOfWeek(typeof date === "string" && isISODate(date) ? date : todayISO(APP_TIME_ZONE));
  const days = weekDays(weekStart);
  const [team, shifts] = await Promise.all([getTeam(companyId), getShifts(companyId, weekStart, addDays(weekStart, 6))]);

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
            <th scope="col" className="w-20 border border-neutral-400 p-2 text-right">
              Ore
            </th>
          </tr>
        </thead>
        <tbody>
          {team.map((m) => {
            const own = shifts.filter((s) => s.userId === m.id);
            const total = own.reduce((sum, s) => sum + shiftMinutes(s), 0);
            return (
              <tr key={m.id} className="break-inside-avoid">
                <th scope="row" className="border border-neutral-400 p-2 text-left align-top font-medium">
                  <MemberChip name={`${m.firstName} ${m.lastName}`} color={m.color} />
                </th>
                {days.map((day) => (
                  <td key={day} className="border border-neutral-400 p-2 align-top">
                    {own
                      .filter((s) => s.date === day)
                      .map((s) => (
                        <p key={s.id} className="tabular-nums">
                          {s.start}–{s.end}
                          {s.note && <span className="block text-xs text-neutral-600">{s.note}</span>}
                        </p>
                      ))}
                  </td>
                ))}
                <td className="border border-neutral-400 p-2 text-right align-top tabular-nums">
                  {total > 0 ? formatMinutes(total) : "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
