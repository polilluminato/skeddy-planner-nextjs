import { describe, expect, it } from "vitest";
import { buildTimeline, firstUnreadId, parseMessageLimit, type MessageRow } from "./messages";

const ada = { id: "u1", firstName: "Ada", lastName: "Rossi", color: "#5645d4" };
const bea = { id: "u2", firstName: "Bea", lastName: "Verdi", color: "#0f7b6c" };

const msg = (id: string, iso: string, author: MessageRow["author"] = ada): MessageRow => ({
  id,
  body: `testo ${id}`,
  createdAt: new Date(iso),
  author,
});

describe("buildTimeline", () => {
  const now = new Date("2026-10-02T10:00:00Z");

  it("raggruppa per giorno nel fuso di Roma", () => {
    const items = buildTimeline(
      [
        msg("a", "2026-09-29T08:00:00Z"),
        // 23:30 UTC del 30 = 01:30 del 1° ottobre a Roma
        msg("b", "2026-09-30T23:30:00Z", bea),
        msg("c", "2026-10-02T07:15:00Z"),
        msg("d", "2026-10-02T08:00:00Z", null),
      ],
      { meId: "u1", now },
    );
    expect(items.map((i) => (i.kind === "day" ? i.label : i.id))).toEqual([
      "Martedì 29 settembre",
      "a",
      "Ieri",
      "b",
      "Oggi",
      "c",
      "d",
    ]);
  });

  it("descrive ogni messaggio", () => {
    const [, a, , b] = buildTimeline([msg("a", "2026-10-02T07:15:00Z"), msg("b", "2026-10-03T07:15:00Z", null)], {
      meId: "u1",
      now,
    });
    expect(a).toMatchObject({ time: "09:15", authorName: "Ada Rossi", authorColor: "#5645d4", mine: true });
    expect(b).toMatchObject({ authorName: "Ex amministratore", authorColor: null, mine: false });
  });
});

describe("firstUnreadId", () => {
  const rows = [msg("a", "2026-10-01T08:00:00Z"), msg("b", "2026-10-02T08:00:00Z"), msg("c", "2026-10-02T09:00:00Z", bea)];

  it("trova il primo messaggio di altri dopo la lettura", () => {
    expect(firstUnreadId(rows, new Date("2026-10-01T12:00:00Z"), "u2")).toBe("b");
    expect(firstUnreadId(rows, new Date("2026-10-01T12:00:00Z"), "u1")).toBe("c");
    expect(firstUnreadId(rows, new Date("2026-10-02T09:00:00Z"), "u1")).toBeNull();
  });
});

describe("parseMessageLimit", () => {
  it("usa multipli della pagina entro il massimo", () => {
    expect(parseMessageLimit(undefined)).toBe(50);
    expect(parseMessageLimit("abc")).toBe(50);
    expect(parseMessageLimit("-10")).toBe(50);
    expect(parseMessageLimit("100")).toBe(100);
    expect(parseMessageLimit("120")).toBe(150);
    expect(parseMessageLimit(["100", "200"])).toBe(100);
    expect(parseMessageLimit("99999")).toBe(500);
  });
});
