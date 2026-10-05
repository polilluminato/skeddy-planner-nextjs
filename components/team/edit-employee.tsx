"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { updateEmployee } from "@/actions/employees";
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
import { EmployeeFields, type EmployeeDefaults } from "./employee-fields";

export function EditEmployee({ employeeId, defaults }: { employeeId: string; defaults: EmployeeDefaults }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="outline" className="h-11 flex-1 text-base">
          <PencilIcon aria-hidden />
          Modifica
        </Button>
      </ModalTrigger>
      <ModalContent>
        {open && <EditForm employeeId={employeeId} defaults={defaults} onDone={() => setOpen(false)} />}
      </ModalContent>
    </Modal>
  );
}

function EditForm({
  employeeId,
  defaults,
  onDone,
}: {
  employeeId: string;
  defaults: EmployeeDefaults;
  onDone: () => void;
}) {
  const action = updateEmployee.bind(null, employeeId);
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      toast.success("Dati aggiornati");
      onDone();
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md overflow-y-auto" noValidate>
      <ModalHeader className="text-left">
        <ModalTitle>Modifica dipendente</ModalTitle>
        <ModalDescription>Nome, ore settimanali e colore nel calendario.</ModalDescription>
      </ModalHeader>
      <div className="grid gap-4 px-4">
        <EmployeeFields defaults={defaults} />
        <FormError message={state.error} />
      </div>
      <ModalFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SubmitButton pending={pending}>Salva</SubmitButton>
      </ModalFooter>
    </form>
  );
}
