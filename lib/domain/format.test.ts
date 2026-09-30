import { describe, expect, it } from "vitest";
import { dayOfMonth, formatLongDay, formatMonthYear, formatShortWeekday, formatWeekRange, weekdayLabels } from "./format";

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
});
