"use client";

import { useState } from "react";
import { minuteOptions } from "@/lib/domain/shifts";

const SELECT_CLASS =
  "h-11 min-w-0 flex-1 rounded-lg border border-input bg-transparent px-2 text-center text-base tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Orario `HH:MM` sempre in formato 24 ore: `<input type="time">` segue la lingua del
 * browser e può mostrare AM/PM. Due select native (ore, minuti) e un campo nascosto `name`.
 */
export function TimeField({
  id,
  name,
  label,
  defaultValue,
}: {
  id: string;
  name: string;
  /** Nome accessibile del gruppo (es. "Inizio"), letto prima di "ore"/"minuti". */
  label: string;
  defaultValue: string;
}) {
  const [hour, setHour] = useState(Number(defaultValue.slice(0, 2)));
  const [minute, setMinute] = useState(Number(defaultValue.slice(3, 5)));

  return (
    <div role="group" aria-label={label} className="flex items-center gap-1.5">
      <input type="hidden" name={name} value={`${pad(hour)}:${pad(minute)}`} />
      <select
        id={id}
        aria-label={`${label}, ore`}
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        className={SELECT_CLASS}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {pad(h)}
          </option>
        ))}
      </select>
      <span aria-hidden className="font-semibold text-muted-foreground">
        :
      </span>
      <select
        aria-label={`${label}, minuti`}
        value={minute}
        onChange={(e) => setMinute(Number(e.target.value))}
        className={SELECT_CLASS}
      >
        {minuteOptions(15, minute).map((m) => (
          <option key={m} value={m}>
            {pad(m)}
          </option>
        ))}
      </select>
    </div>
  );
}
