import { describe, expect, it } from "vitest";
import {
  findOverlap,
  formatMinutes,
  isValidRange,
  minutesToHoursInput,
  parseHours,
  rangesOverlap,
  shiftMinutes,
  sortByStart,
  totalMinutes,
  weeklyStatus,
} from "./shifts";

describe("shifts", () => {
  it("valida l'intervallo nello stesso giorno", () => {
    expect(isValidRange({ start: "08:00", end: "12:00" })).toBe(true);
    expect(isValidRange({ start: "12:00", end: "12:00" })).toBe(false);
    expect(isValidRange({ start: "22:00", end: "06:00" })).toBe(false);
    expect(isValidRange({ start: "8:00", end: "12:00" })).toBe(false);
    expect(isValidRange({ start: "24:00", end: "25:00" })).toBe(false);
  });

  it("calcola la durata", () => {
    expect(shiftMinutes({ start: "08:15", end: "12:45" })).toBe(270);
    expect(totalMinutes([{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:30" }])).toBe(510);
  });

  it("considera adiacenti i turni che si toccano", () => {
    expect(rangesOverlap({ start: "08:00", end: "12:00" }, { start: "12:00", end: "16:00" })).toBe(false);
    expect(rangesOverlap({ start: "08:00", end: "12:00" }, { start: "11:59", end: "16:00" })).toBe(true);
    expect(rangesOverlap({ start: "09:00", end: "10:00" }, { start: "08:00", end: "12:00" })).toBe(true);
  });

  it("trova la sovrapposizione ignorando il turno in modifica", () => {
    const existing = [
      { id: "a", start: "08:00", end: "12:00" },
      { id: "b", start: "14:00", end: "18:00" },
    ];
    expect(findOverlap({ start: "11:00", end: "13:00" }, existing)?.id).toBe("a");
    expect(findOverlap({ id: "a", start: "07:00", end: "13:00" }, existing)).toBeUndefined();
    expect(findOverlap({ start: "12:00", end: "14:00" }, existing)).toBeUndefined();
  });

  it("ordina per orario di inizio", () => {
    const sorted = sortByStart([{ start: "14:00", end: "18:00" }, { start: "08:00", end: "12:00" }]);
    expect(sorted[0].start).toBe("08:00");
  });

  it("confronta con le ore previste", () => {
    expect(weeklyStatus(100, 0)).toBe("unset");
    expect(weeklyStatus(100, 200)).toBe("under");
    expect(weeklyStatus(200, 200)).toBe("ok");
    expect(weeklyStatus(300, 200)).toBe("over");
  });

  it("formatta e interpreta le ore", () => {
    expect(formatMinutes(450)).toBe("7h 30m");
    expect(formatMinutes(480)).toBe("8h");
    expect(formatMinutes(-65)).toBe("-1h 05m");
    expect(parseHours("37,5")).toBe(2250);
    expect(parseHours("40")).toBe(2400);
    expect(parseHours("abc")).toBeNull();
    expect(parseHours("200")).toBeNull();
    expect(minutesToHoursInput(2250)).toBe("37,5");
    expect(minutesToHoursInput(2400)).toBe("40");
  });
});
