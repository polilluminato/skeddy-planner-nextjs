import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
};

/** Etichetta + input con altezza touch-friendly e hint collegato via aria-describedby. */
export function Field({ label, hint, id, name, className, ...props }: FieldProps) {
  const fieldId = id ?? name;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={fieldId} className="text-sm">
        {label}
      </Label>
      <Input
        id={fieldId}
        name={name}
        aria-describedby={hintId}
        className={cn("h-11 text-base md:text-base", className)}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
