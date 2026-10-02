/** Normalizza l'input dell'utente: minuscole, spazi/punti/trattini multipli → un solo "-". */
export function normalizeCompanyCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z]+/)
    .filter(Boolean)
    .join("-");
}
