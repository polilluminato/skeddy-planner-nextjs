import { describe, expect, it } from "vitest";
import { afterFailure, isLocked, LOCK_MINUTES, MAX_ATTEMPTS, minutesLeft } from "./rate-limit";

describe("rate limit", () => {
  const now = new Date("2026-09-30T10:00:00Z");

  it("blocca al quinto tentativo fallito", () => {
    let state = null as ReturnType<typeof afterFailure> | null;
    for (let i = 1; i < MAX_ATTEMPTS; i++) {
      state = afterFailure(state, now);
      expect(isLocked(state, now)).toBe(false);
    }
    state = afterFailure(state, now);
    expect(isLocked(state, now)).toBe(true);
    expect(state.lockedUntil!.getTime() - now.getTime()).toBe(LOCK_MINUTES * 60_000);
  });

  it("sblocca a scadenza e riparte da zero", () => {
    const expired = { count: 0, lockedUntil: new Date(now.getTime() - 1000) };
    expect(isLocked(expired, now)).toBe(false);
    expect(afterFailure(expired, now)).toEqual({ count: 1, lockedUntil: null });
  });

  it("arrotonda i minuti rimanenti per eccesso", () => {
    expect(minutesLeft(new Date(now.getTime() + 61_000), now)).toBe(2);
  });
});
