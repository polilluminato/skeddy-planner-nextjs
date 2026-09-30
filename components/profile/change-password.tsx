"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { changePassword } from "@/actions/profile";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await changePassword(prev, formData);
    if (result.ok) {
      toast.success("Password aggiornata");
      formRef.current?.reset();
    }
    return result;
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Password attuale" name="currentPassword" type="password" autoComplete="current-password" required />
      <Field
        label="Nuova password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        minLength={10}
        hint="Almeno 10 caratteri."
        required
      />
      <Field label="Ripeti la nuova password" name="confirmPassword" type="password" autoComplete="new-password" required />
      <FormError message={state.error} />
      <SubmitButton pending={pending} variant="outline">
        Cambia password
      </SubmitButton>
    </form>
  );
}
