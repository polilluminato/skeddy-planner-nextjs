"use client";

import { signupOrganization } from "@/actions/auth";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";

/** Iscrizione dell'Amministrazione: entra con email e password e gestisce più negozi. */
export function OrganizationSignupForm() {
  const { state, onSubmit, pending } = useFormAction(signupOrganization);
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Nome dell'organizzazione" name="organizationName" autoComplete="organization" required />
      <Field
        label="Nome del primo negozio"
        name="companyName"
        required
        hint="Potrai aggiungere gli altri negozi dopo."
      />
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
        hint="Almeno 10 caratteri."
      />
      <FormError message={state.error} />
      <SubmitButton pending={pending}>Crea organizzazione</SubmitButton>
    </form>
  );
}
