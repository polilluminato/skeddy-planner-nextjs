"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { createEmployee, type CodeResult } from "@/actions/employees";
import { CodeReveal } from "@/components/common/code-reveal";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useFormAction } from "@/hooks/use-form-action";
import { formatPersonalCode } from "@/lib/domain/personal-code";
import { EmployeeFields } from "./employee-fields";

export function CreateEmployee({ companyCode }: { companyCode: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-11 text-base">
          <PlusIcon className="size-5" aria-hidden />
          Nuovo dipendente
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* Montato solo da aperto: a ogni apertura riparte da un form vuoto. */}
        {open && <CreateForm companyCode={companyCode} onClose={() => setOpen(false)} />}
      </DrawerContent>
    </Drawer>
  );
}

function CreateForm({ companyCode, onClose }: { companyCode: string; onClose: () => void }) {
  const { state, onSubmit, pending } = useFormAction<CodeResult>(createEmployee);

  if (state.ok && state.personalCode) {
    return (
      <div className="mx-auto grid w-full max-w-md gap-4 overflow-y-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle>{state.name} aggiunto</DrawerTitle>
          <DrawerDescription>
            Comunica questi codici di persona o a voce: il codice personale non verrà più mostrato.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <CodeReveal label="Codice azienda" value={companyCode} />
          <CodeReveal
            label="Codice personale"
            value={state.personalCode}
            display={formatPersonalCode(state.personalCode)}
          />
        </div>
        <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button className="h-11 text-base" onClick={onClose}>
            Fatto
          </Button>
        </DrawerFooter>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md overflow-y-auto" noValidate>
      <DrawerHeader className="text-left">
        <DrawerTitle>Nuovo dipendente</DrawerTitle>
        <DrawerDescription>Il codice personale viene generato in automatico.</DrawerDescription>
      </DrawerHeader>
      <div className="grid gap-4 px-4">
        <EmployeeFields />
        <FormError message={state.error} />
      </div>
      <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SubmitButton pending={pending}>Crea dipendente</SubmitButton>
      </DrawerFooter>
    </form>
  );
}
