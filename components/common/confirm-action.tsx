"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
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
import type { ActionState } from "@/lib/action-state";

type Props = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  action: () => Promise<ActionState>;
  successMessage?: string;
  destructive?: boolean;
  onDone?: () => void;
};

/** Conferma per azioni irreversibili: AlertDialog + useTransition + toast. */
export function ConfirmAction({
  trigger,
  title,
  description,
  confirmLabel,
  action,
  successMessage,
  destructive = true,
  onDone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm(event: React.MouseEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (successMessage) toast.success(successMessage);
      setOpen(false);
      onDone?.();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11" disabled={pending}>
            Annulla
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-11"
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={confirm}
          >
            {pending ? "Attendi…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
