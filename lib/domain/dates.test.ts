import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  endOfMonth,
  isISODate,
  monthGrid,
  startOfWeek,
  todayISO,
  weekDays,
  weekdayIndex,
} from "./dates";

describe("dates", () => {
  it("valida le date ISO", () => {
    expect(isISODate("2026-02-28")).toBe(true);
    expect(isISODate("2026-02-30")).toBe(false);
    expect(isISODate("2026-2-3")).toBe(false);
  });

  it("calcola oggi nel fuso indicato, non in quello del server", () => {
    // 23:30 UTC del 30/09 è già il 1/10 a Roma (UTC+2)
    const now = new Date("2026-09-30T23:30:00Z");
    expect(todayISO("Europe/Rome", now)).toBe("2026-10-01");
    expect(todayISO("UTC", now)).toBe("2026-09-30");
  });

  it("somma giorni attraverso mesi e cambio d'ora", () => {
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("somma mesi limitando il giorno", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-03-15", -3)).toBe("2025-12-15");
  });

  it("usa settimane da lunedì a domenica", () => {
    expect(weekdayIndex("2026-09-28")).toBe(0); // lunedì
    expect(weekdayIndex("2026-10-04")).toBe(6); // domenica
    expect(startOfWeek("2026-10-04")).toBe("2026-09-28");
    expect(weekDays("2026-09-30")).toEqual([
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
    ]);
  });

  it("costruisce la griglia del mese", () => {
    const grid = monthGrid("2026-09-15");
    expect(grid[0][0]).toBe("2026-08-31");
    expect(grid.at(-1)!.at(-1)).toBe("2026-10-04");
    expect(grid).toHaveLength(5);
    expect(endOfMonth("2028-02-10")).toBe("2028-02-29");
  });
});
