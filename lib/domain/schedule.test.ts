import { describe, expect, it } from "vitest";
import { groupByDate, hoursSummary, minutesByUser } from "./schedule";

const shifts = [
  { userId: "a", date: "2026-09-29", start: "14:00", end: "18:00" },
  { userId: "a", date: "2026-09-29", start: "08:00", end: "12:00" },
  { userId: "b", date: "2026-09-30", start: "09:00", end: "13:30" },
];

describe("schedule", () => {
  it("raggruppa per data ordinando per inizio", () => {
    const map = groupByDate(shifts);
    expect(map.get("2026-09-29")!.map((s) => s.start)).toEqual(["08:00", "14:00"]);
    expect(map.get("2026-09-30")).toHaveLength(1);
  });

  it("somma i minuti per utente", () => {
    const map = minutesByUser(shifts);
    expect(map.get("a")).toBe(480);
    expect(map.get("b")).toBe(270);
  });

  it("produce il riepilogo ore con lo stato", () => {
    const rows = hoursSummary(
      [
        { id: "a", weeklyMinutes: 480 },
        { id: "b", weeklyMinutes: 600 },
        { id: "c", weeklyMinutes: 0 },
      ],
      shifts,
    );
    expect(rows).toEqual([
      { userId: "a", planned: 480, target: 480, status: "ok" },
      { userId: "b", planned: 270, target: 600, status: "under" },
      { userId: "c", planned: 0, target: 0, status: "unset" },
    ]);
  });
});
