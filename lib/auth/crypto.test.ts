import { describe, expect, it } from "vitest";
import { hmacCode, randomToken, safeEqual, sha256 } from "./crypto";

describe("auth crypto", () => {
  it("HMAC dipende dal segreto ed è deterministico", () => {
    expect(hmacCode("ABCDEFGH", "s1")).toBe(hmacCode("ABCDEFGH", "s1"));
    expect(hmacCode("ABCDEFGH", "s1")).not.toBe(hmacCode("ABCDEFGH", "s2"));
    expect(hmacCode("ABCDEFGH", "s1")).toHaveLength(64);
  });

  it("genera token casuali distinti", () => {
    const a = randomToken();
    expect(a).not.toBe(randomToken());
    expect(a.length).toBeGreaterThanOrEqual(43);
  });

  it("confronta in modo sicuro", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abcd")).toBe(false);
    expect(sha256("x")).toHaveLength(64);
  });
});
