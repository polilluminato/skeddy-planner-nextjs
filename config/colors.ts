/**
 * Palette per distinguere i dipendenti nel calendario (colori come dati, applicati via style).
 * Niente neutri (il brand è monocromo: "oggi", "i miei turni") né rosso/verde/arancio (sono gli stati delle ore);
 * ogni colore regge il testo bianco sopra (≥ 4.5:1, turni del calendario) e ha contrasto ≥ 3:1 su `--card` scuro (#1a1a1a).
 */
export const EMPLOYEE_COLORS = [
  { value: "#2a74c4", label: "Blu" },
  { value: "#127d78", label: "Verde acqua" },
  { value: "#8f6b0e", label: "Ocra" },
  { value: "#c03f94", label: "Magenta" },
  { value: "#62728a", label: "Ardesia" },
  { value: "#6b7618", label: "Oliva" },
  { value: "#c0446c", label: "Rosa antico" },
  { value: "#94673d", label: "Marrone" },
] as const;

export const EMPLOYEE_COLOR_VALUES = EMPLOYEE_COLORS.map((c) => c.value) as string[];

export function colorForIndex(index: number): string {
  return EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length].value;
}
