import type { NextRequest } from "next/server";
import { APP_TIME_ZONE } from "@/config/app";
import { requireAdmin } from "@/lib/auth/guards";
import { toCsv } from "@/lib/domain/csv";
import { endOfMonth, isISODate, startOfMonth, todayISO } from "@/lib/domain/dates";
import { formatShortWeekday } from "@/lib/domain/format";
import { minutesToHoursInput, shiftMinutes } from "@/lib/domain/shifts";
import { getShifts, getTeam } from "@/lib/queries";

/** Turni di un mese (`?month=YYYY-MM`) in CSV: una riga per turno, comoda da filtrare in Excel. */
export async function GET(request: NextRequest) {
  const { companyId } = await requireAdmin();
  const param = request.nextUrl.searchParams.get("month") ?? "";
  const from = isISODate(`${param}-01`) ? `${param}-01` : startOfMonth(todayISO(APP_TIME_ZONE));

  const [team, shifts] = await Promise.all([getTeam(companyId), getShifts(companyId, from, endOfMonth(from))]);
  const names = new Map(team.map((m) => [m.id, `${m.firstName} ${m.lastName}`]));

  const csv = toCsv([
    ["Data", "Giorno", "Dipendente", "Inizio", "Fine", "Ore", "Nota"],
    ...shifts.map((s) => [
      s.date,
      formatShortWeekday(s.date),
      names.get(s.userId) ?? "",
      s.start,
      s.end,
      minutesToHoursInput(shiftMinutes(s)),
      s.note ?? "",
    ]),
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="turni-${from.slice(0, 7)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
