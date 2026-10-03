import { describe, expect, it } from "vitest";
import { calendarHref, parseCalendarState, shiftPeriod, visibleRange } from "./calendar";

describe("calendar", () => {
  const today = "2026-09-30";

  it("interpreta i searchParams con fallback", () => {
    expect(parseCalendarState({}, today)).toEqual({ view: "week", date: today });
    expect(parseCalendarState({ view: "day", date: "2026-01-15" }, today)).toEqual({ view: "day", date: "2026-01-15" });
    expect(parseCalendarState({ view: "month", date: "2026-01-15" }, today)).toEqual({ view: "week", date: "2026-01-15" });
    expect(parseCalendarState({ view: "year", date: "2026-13-01" }, today)).toEqual({ view: "week", date: today });
    expect(parseCalendarState({ view: ["day"], date: ["x"] }, today)).toEqual({ view: "week", date: today });
  });

  it("si sposta di un periodo", () => {
    expect(shiftPeriod({ view: "day", date: today }, 1)).toBe("2026-10-01");
    expect(shiftPeriod({ view: "week", date: today }, -1)).toBe("2026-09-23");
  });

  it("calcola l'intervallo visibile", () => {
    expect(visibleRange({ view: "day", date: today })).toEqual({ from: today, to: today });
    expect(visibleRange({ view: "week", date: today })).toEqual({ from: "2026-09-28", to: "2026-10-04" });
  });

  it("costruisce il link", () => {
    expect(calendarHref({ view: "day", date: today })).toBe("/calendar?view=day&date=2026-09-30");
  });
});
