import { describe, expect, it } from "vitest";
import { layoutOverlaps, minuteOffset, minutesToTime, slotRange, verticalPosition, visibleHours } from "./time-grid";

const s = (id: string, start: string, end: string) => ({ id, start, end });

describe("time-grid", () => {
  it("usa la fascia di default e la allarga per contenere i turni", () => {
    expect(visibleHours([])).toEqual({ from: 8, to: 20 });
    expect(visibleHours([s("a", "09:00", "17:00")])).toEqual({ from: 8, to: 20 });
    expect(visibleHours([s("a", "05:30", "12:00"), s("b", "18:00", "22:15")])).toEqual({ from: 5, to: 23 });
  });

  it("lascia a tutta larghezza i turni che non si sovrappongono", () => {
    const placed = layoutOverlaps([s("b", "12:00", "16:00"), s("a", "08:00", "12:00")]);
    expect(placed.map((p) => [p.item.id, p.column, p.columns])).toEqual([
      ["a", 0, 1],
      ["b", 0, 1],
    ]);
  });

  it("affianca i turni sovrapposti e riusa le colonne libere", () => {
    const placed = layoutOverlaps([
      s("a", "08:00", "12:00"),
      s("b", "09:00", "13:00"),
      s("c", "12:00", "14:00"),
      s("d", "15:00", "18:00"),
    ]);
    expect(placed.map((p) => [p.item.id, p.column, p.columns])).toEqual([
      ["a", 0, 2],
      ["b", 1, 2],
      ["c", 0, 2],
      ["d", 0, 1],
    ]);
  });

  it("usa tante colonne quanti sono i turni contemporanei", () => {
    const placed = layoutOverlaps([s("a", "08:00", "16:00"), s("b", "08:00", "12:00"), s("c", "09:00", "10:00")]);
    expect(placed.map((p) => p.columns)).toEqual([3, 3, 3]);
    expect(new Set(placed.map((p) => p.column)).size).toBe(3);
  });

  it("calcola la posizione verticale in percentuale", () => {
    expect(verticalPosition(s("a", "08:00", "12:00"), { from: 8, to: 16 })).toEqual({ top: 0, height: 50 });
    expect(verticalPosition(s("a", "12:30", "13:00"), { from: 8, to: 18 })).toEqual({ top: 45, height: 5 });
    expect(minuteOffset(13 * 60, { from: 8, to: 18 })).toBe(50);
    expect(minuteOffset(6 * 60, { from: 8, to: 18 })).toBeNull();
  });

  it("propone un orario da uno slot senza superare la mezzanotte", () => {
    expect(slotRange(9)).toEqual({ start: "09:00", end: "13:00" });
    expect(slotRange(22)).toEqual({ start: "22:00", end: "23:59" });
    expect(minutesToTime(-5)).toBe("00:00");
    expect(minutesToTime(7 * 60 + 5)).toBe("07:05");
  });
});
