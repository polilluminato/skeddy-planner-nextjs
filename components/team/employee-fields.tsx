import { Field } from "@/components/common/field";
import { EMPLOYEE_COLORS } from "@/config/colors";
import { minutesToHoursInput } from "@/lib/domain/shifts";

export type EmployeeDefaults = {
  firstName?: string;
  lastName?: string;
  weeklyMinutes?: number;
  color?: string;
};

export function EmployeeFields({ defaults = {} }: { defaults?: EmployeeDefaults }) {
  const color = defaults.color ?? EMPLOYEE_COLORS[0].value;
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" name="firstName" defaultValue={defaults.firstName} autoComplete="off" required />
        <Field label="Cognome" name="lastName" defaultValue={defaults.lastName} autoComplete="off" required />
      </div>
      <Field
        label="Ore settimanali previste"
        name="weeklyHours"
        inputMode="decimal"
        placeholder="es. 38 o 37,5"
        defaultValue={defaults.weeklyMinutes ? minutesToHoursInput(defaults.weeklyMinutes) : ""}
        hint="Servono per il riepilogo: non bloccano l'inserimento dei turni."
      />
      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-sm font-medium">Colore nel calendario</legend>
        <div className="flex flex-wrap gap-2">
          {EMPLOYEE_COLORS.map((c) => (
            <label key={c.value} className="relative flex size-11 cursor-pointer items-center justify-center">
              <input
                type="radio"
                name="color"
                value={c.value}
                defaultChecked={c.value === color}
                className="peer sr-only"
              />
              <span
                className="size-8 rounded-full ring-offset-2 ring-offset-background peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ring"
                style={{ background: c.value }}
                aria-hidden
              />
              <span className="sr-only">{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
