"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { createEmployee, type CodeResult } from "@/actions/employees";
import { CodeReveal } from "@/components/common/code-reveal";
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
import { formatPersonalCode } from "@/lib/domain/personal-code";
import { EmployeeFields } from "./employee-fields";

export function CreateEmployee({ companyCode }: { companyCode: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button className="h-11 text-base">
          <PlusIcon className="size-5" aria-hidden />
          Nuovo dipendente
        </Button>
      </ModalTrigger>
      <ModalContent>
        {/* Montato solo da aperto: a ogni apertura riparte da un form vuoto. */}
        {open && <CreateForm companyCode={companyCode} onClose={() => setOpen(false)} />}
      </ModalContent>
    </Modal>
  );
}

function CreateForm({ companyCode, onClose }: { companyCode: string; onClose: () => void }) {
  const { state, onSubmit, pending } = useFormAction<CodeResult>(createEmployee);

  if (state.ok && state.personalCode) {
    return (
      <div className="mx-auto grid w-full max-w-md gap-4 overflow-y-auto">
        <ModalHeader className="text-left">
          <ModalTitle>{state.name} aggiunto</ModalTitle>
          <ModalDescription>
            Comunica questi codici di persona o a voce: il codice personale non verrà più mostrato.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4 px-4">
          <CodeReveal label="Codice azienda" value={companyCode} />
          <CodeReveal
            label="Codice personale"
            value={state.personalCode}
            display={formatPersonalCode(state.personalCode)}
          />
        </div>
        <ModalFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button className="h-11 text-base" onClick={onClose}>
            Fatto
          </Button>
        </ModalFooter>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md overflow-y-auto" noValidate>
      <ModalHeader className="text-left">
        <ModalTitle>Nuovo dipendente</ModalTitle>
        <ModalDescription>Il codice personale viene generato in automatico.</ModalDescription>
      </ModalHeader>
      <div className="grid gap-4 px-4">
        <EmployeeFields />
        <FormError message={state.error} />
      </div>
      <ModalFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SubmitButton pending={pending}>Crea dipendente</SubmitButton>
      </ModalFooter>
    </form>
  );
}
