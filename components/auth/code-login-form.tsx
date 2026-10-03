"use client";

import { loginWithCodes } from "@/actions/auth";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";

export function CodeLoginForm() {
  const { state, onSubmit, pending } = useFormAction(loginWithCodes);
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field
        label="Codice azienda"
        name="companyCode"
        placeholder="es. albero-marmo-vento-fiocco"
        autoComplete="organization"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
        hint="Quattro parole separate da un trattino."
      />
      <Field
        label="Codice personale"
        name="personalCode"
        placeholder="es. ABCD EFGH"
        autoComplete="current-password"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className="uppercase tracking-wider"
        required
        hint="8 caratteri, ricevuto dal tuo amministratore."
      />
      <FormError message={state.error} />
      <SubmitButton pending={pending}>Entra</SubmitButton>
    </form>
  );
}
