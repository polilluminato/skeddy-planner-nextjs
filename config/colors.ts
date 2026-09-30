/** Palette per distinguere i dipendenti nel calendario (colori come dati, applicati via style). */
export const EMPLOYEE_COLORS = [
  { value: "#5645d4", label: "Viola" },
  { value: "#0075de", label: "Blu" },
  { value: "#2a9d99", label: "Verde acqua" },
  { value: "#1aae39", label: "Verde" },
  { value: "#dd5b00", label: "Arancio" },
  { value: "#e03131", label: "Rosso" },
  { value: "#d6409f", label: "Rosa" },
  { value: "#8a6d3b", label: "Marrone" },
] as const;

export const EMPLOYEE_COLOR_VALUES = EMPLOYEE_COLORS.map((c) => c.value) as string[];

export function colorForIndex(index: number): string {
  return EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length].value;
}
