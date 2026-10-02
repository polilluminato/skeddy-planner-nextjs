/**
 * Palette per distinguere i dipendenti nel calendario (colori come dati, applicati via style).
 * Niente viola (è il brand: "oggi", "i miei turni") né rosso/verde/arancio (sono gli stati delle ore);
 * ogni colore ha contrasto ≥ 3:1 sia su `--card` chiaro (#ffffff) sia scuro (#222220).
 */
export const EMPLOYEE_COLORS = [
  { value: "#2f7fd6", label: "Blu" },
  { value: "#138a84", label: "Verde acqua" },
  { value: "#a87a12", label: "Ocra" },
  { value: "#c03f94", label: "Magenta" },
  { value: "#687990", label: "Ardesia" },
  { value: "#7d8a1c", label: "Oliva" },
  { value: "#d1547a", label: "Rosa antico" },
  { value: "#94673d", label: "Marrone" },
] as const;

export const EMPLOYEE_COLOR_VALUES = EMPLOYEE_COLORS.map((c) => c.value) as string[];

export function colorForIndex(index: number): string {
  return EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length].value;
}
