"use client";

import { toast } from "sonner";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";
import type { ActionState } from "@/lib/action-state";

/** Un solo campo nome, precompilato: per l'organizzazione e per i negozi. */
export function RenameForm({
  label,
  name,
  defaultValue,
  action,
  onDone,
}: {
  label: string;
  name: string;
  defaultValue: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  onDone?: () => void;
}) {
  const { state, onSubmit, pending } = useFormAction(async (prev: ActionState, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      toast.success("Nome aggiornato");
      onDone?.();
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label={label} name={name} defaultValue={defaultValue} required />
      <FormError message={state.error} />
      <SubmitButton pending={pending} variant="outline">
        Salva nome
      </SubmitButton>
    </form>
  );
}
