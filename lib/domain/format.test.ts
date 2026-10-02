import { describe, expect, it } from "vitest";
import { dayOfMonth, formatClock, formatNumericDate, formatLongDay, formatMonthYear, formatShortWeekday, formatWeekRange, weekdayLabels } from "./format";

describe("format", () => {
  it("formatta in italiano senza slittare di giorno", () => {
    expect(formatLongDay("2026-09-30")).toBe("Mercoledì 30 settembre");
    expect(formatShortWeekday("2026-09-28")).toBe("lun");
    expect(formatMonthYear("2026-09-30")).toBe("Settembre 2026");
    expect(formatWeekRange("2026-09-30")).toBe("28 set – 4 ott 2026");
    expect(dayOfMonth("2026-09-05")).toBe(5);
  });

  it("elenca i giorni da lunedì", () => {
    expect(weekdayLabels()).toEqual(["lun", "mar", "mer", "gio", "ven", "sab", "dom"]);
  });

  it("formatta l'ora nel fuso indicato", () => {
    expect(formatNumericDate("2026-10-02")).toBe("02/10/2026");
    expect(formatClock(new Date("2026-10-02T12:05:00Z"))).toBe("14:05");
    expect(formatClock(new Date("2026-01-15T23:30:00Z"))).toBe("00:30");
  });
});
