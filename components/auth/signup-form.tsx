"use client";

import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { signup, type SignupResult } from "@/actions/auth";
import { CodeReveal } from "@/components/common/code-reveal";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { useFormAction } from "@/hooks/use-form-action";
import { formatPersonalCode } from "@/lib/domain/personal-code";

export function SignupForm() {
  const { state, onSubmit, pending } = useFormAction<SignupResult>(signup);

  if (state.ok && state.companyCode && state.personalCode) {
    return (
      <section aria-labelledby="signup-done" className="grid gap-5">
        <div className="grid gap-1">
          <h1 id="signup-done" className="text-2xl font-semibold tracking-tight">
            Azienda creata
          </h1>
          <p className="text-muted-foreground">Ecco i tuoi codici di accesso.</p>
        </div>
        <CodeReveal label="Codice azienda" value={state.companyCode} />
        <CodeReveal
          label="Codice personale"
          value={state.personalCode}
          display={formatPersonalCode(state.personalCode)}
        />
        <p className="flex gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <span>
            Salva il codice personale: non verrà più mostrato. Il codice azienda resta visibile nel profilo e va
            comunicato ai dipendenti.
          </span>
        </p>
        <Button asChild className="h-11 text-base">
          <Link href="/calendar">Vai al calendario</Link>
        </Button>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Nome dell'azienda" name="companyName" autoComplete="organization" required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" name="firstName" autoComplete="given-name" required />
        <Field label="Cognome" name="lastName" autoComplete="family-name" required />
      </div>
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
      <SubmitButton pending={pending}>Crea azienda</SubmitButton>
    </form>
  );
}
