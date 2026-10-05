"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createCompany } from "@/actions/organization";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/common/modal";
import { useFormAction } from "@/hooks/use-form-action";

export function CreateCompany() {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="h-11 text-base">
          <PlusIcon className="size-5" aria-hidden />
          Nuovo negozio
        </Button>
      </ModalTrigger>
      <ModalContent>
        {/* Montato solo da aperto: a ogni apertura riparte da un form vuoto. */}
        {open && <CreateForm onClose={() => setOpen(false)} />}
      </ModalContent>
    </Modal>
  );
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await createCompany(prev, formData);
    if (result.ok) {
      toast.success("Negozio creato");
      onClose();
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md overflow-y-auto" noValidate>
      <ModalHeader className="text-left">
        <ModalTitle>Nuovo negozio</ModalTitle>
        <ModalDescription>Il codice azienda viene generato in automatico.</ModalDescription>
      </ModalHeader>
      <div className="grid gap-4 px-4">
        <Field label="Nome del negozio" name="companyName" required />
        <FormError message={state.error} />
      </div>
      <ModalFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SubmitButton pending={pending}>Crea negozio</SubmitButton>
      </ModalFooter>
    </form>
  );
}
