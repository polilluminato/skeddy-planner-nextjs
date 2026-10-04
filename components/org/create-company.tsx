"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { createCompany } from "@/actions/organization";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { useFormAction } from "@/hooks/use-form-action";

export function CreateCompanyForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await createCompany(prev, formData);
    if (result.ok) {
      toast.success("Negozio creato");
      formRef.current?.reset();
    }
    return result;
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Nome del negozio" name="companyName" required />
      <FormError message={state.error} />
      <SubmitButton pending={pending}>Crea negozio</SubmitButton>
    </form>
  );
}
