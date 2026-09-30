import { CopyButton } from "./copy-button";

/** Mostra un codice di accesso in modo leggibile, con copia. */
export function CodeReveal({ label, value, display }: { label: string; value: string; display?: string }) {
  return (
    <div className="grid gap-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <output
          aria-label={label}
          className="flex min-h-11 flex-1 items-center rounded-lg border bg-muted px-3 font-mono text-lg font-semibold tracking-wide break-all select-all"
        >
          {display ?? value}
        </output>
        <CopyButton value={value} label={`Copia ${label.toLowerCase()}`} />
      </div>
    </div>
  );
}
