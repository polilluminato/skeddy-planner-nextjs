/**
 * CSV per Excel in italiano: separatore ";" (la virgola è il separatore decimale),
 * BOM UTF-8 per gli accenti, righe CRLF.
 */
export function toCsv(rows: readonly (readonly string[])[]): string {
  return "﻿" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n") + "\r\n";
}

function csvCell(value: string): string {
  // Testo che Excel interpreterebbe come formula (=, +, -, @): un apostrofo lo lascia testo.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[";\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}
