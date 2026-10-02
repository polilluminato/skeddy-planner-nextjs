"use client";

import { useState } from "react";
import { formatNumericDate } from "@/lib/domain/format";

/**
 * Data `YYYY-MM-DD` mostrata sempre come `DD/MM/YYYY`: `<input type="date">` usa il formato
 * della lingua del browser. L'input nativo resta sopra, trasparente, e apre il selettore del sistema.
 */
export function DateField({ id, name, defaultValue }: { id: string; name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="relative flex h-11 items-center rounded-lg border border-input px-3 text-base tabular-nums has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 dark:bg-input/30">
      <span aria-hidden className={value ? undefined : "text-muted-foreground"}>
        {value ? formatNumericDate(value) : "GG/MM/AAAA"}
      </span>
      <input
        id={id}
        name={name}
        type="date"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // Su desktop il selettore si apre solo dall'icona: lo apriamo al clic su tutto il campo.
        onClick={(e) => e.currentTarget.showPicker?.()}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  );
}
