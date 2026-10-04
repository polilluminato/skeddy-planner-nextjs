"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { renameCompany } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RenameForm } from "./rename-form";

export function RenameCompany({ companyId, name }: { companyId: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11 shrink-0" aria-label={`Rinomina ${name}`} title="Rinomina">
          <PencilIcon className="size-4" aria-hidden />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto grid w-full max-w-md gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle>Rinomina negozio</DrawerTitle>
            <DrawerDescription>Il codice azienda non cambia.</DrawerDescription>
          </DrawerHeader>
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
      </DrawerContent>
    </Drawer>
  );
}
