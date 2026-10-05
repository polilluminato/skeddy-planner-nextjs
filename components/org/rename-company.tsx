"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { renameCompany } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/common/modal";
import { RenameForm } from "./rename-form";

export function RenameCompany({ companyId, name }: { companyId: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label={`Rinomina ${name}`} title="Rinomina">
          <PencilIcon className="size-4" aria-hidden />
        </Button>
      </ModalTrigger>
      <ModalContent>
        <div className="mx-auto grid w-full max-w-md gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <ModalHeader className="px-0 text-left">
            <ModalTitle>Rinomina negozio</ModalTitle>
            <ModalDescription>Il codice azienda non cambia.</ModalDescription>
          </ModalHeader>
          {/* Montato solo da aperto: riparte sempre dal nome attuale. */}
          {open && (
            <RenameForm
              label="Nome del negozio"
              name="companyName"
              defaultValue={name}
              action={renameCompany.bind(null, companyId)}
              onDone={() => setOpen(false)}
            />
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
