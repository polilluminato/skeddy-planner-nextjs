import { tint } from "@/components/calendar/types";
import { cn } from "@/lib/utils";

/**
 * Nome di un dipendente come chip nel suo colore. Eredita dimensione e colore del testo dal contesto;
 * il bordo pieno lo stacca anche dalle card già tinte (turni del calendario).
 */
export function MemberChip({ name, color, className }: { name: string; color: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center rounded-full border px-[0.6em] py-[0.1em] font-medium [print-color-adjust:exact]",
        className,
      )}
      style={{ background: tint(color, 20), borderColor: tint(color, 60) }}
    >
      <span className="truncate">{name}</span>
    </span>
  );
}
