"use client";

import { useState, useTransition } from "react";
import { KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { regenerateCode } from "@/actions/employees";
import { CodeReveal } from "@/components/common/code-reveal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatPersonalCode } from "@/lib/domain/personal-code";

/** Conferma, genera un nuovo codice e lo mostra una sola volta nello stesso dialogo. */
export function RegenerateCode({ employeeId, name }: { employeeId: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setCode(null);
  }

  function confirm(event: React.MouseEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await regenerateCode(employeeId);
      if (result.error || !result.personalCode) toast.error(result.error ?? "Operazione non riuscita.");
      else setCode(result.personalCode);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="h-11 w-full justify-start text-base">
          <KeyRoundIcon aria-hidden />
          Rigenera codice personale
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {code ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Nuovo codice per {name}</AlertDialogTitle>
              <AlertDialogDescription>Comunicalo ora: non verrà più mostrato.</AlertDialogDescription>
            </AlertDialogHeader>
            <CodeReveal label="Codice personale" value={code} display={formatPersonalCode(code)} />
            <AlertDialogFooter>
              <AlertDialogAction className="h-11">Fatto</AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Rigenerare il codice?</AlertDialogTitle>
              <AlertDialogDescription>
                Il codice attuale di {name} smetterà di funzionare e le sue sessioni aperte verranno chiuse.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-11" disabled={pending}>
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction className="h-11" onClick={confirm} disabled={pending}>
                {pending ? "Attendi…" : "Rigenera"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
