import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("usa ; e CRLF con BOM, tra virgolette solo se serve", () => {
    expect(toCsv([["Data", "Nota"], ["2026-10-01", 'a; "b"\nc']])).toBe(
      '﻿Data;Nota\r\n2026-10-01;"a; ""b""\nc"\r\n',
    );
  });

  it("neutralizza le formule", () => {
    expect(toCsv([["=SOMMA(A1)", "-1", "@x", "8,5"]])).toBe("﻿'=SOMMA(A1);'-1;'@x;8,5\r\n");
  });
});
