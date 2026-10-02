"use client";

import { loginWithEmail } from "@/actions/auth";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";
import type { ActionState } from "@/lib/action-state";

export function EmailLoginForm({
  action = loginWithEmail,
}: {
  action?: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <FormError message={state.error} />
      <SubmitButton pending={pending}>Entra</SubmitButton>
    </form>
  );
}
