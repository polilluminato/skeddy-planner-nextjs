"use client";

import { useState } from "react";
import { KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/actions/profile";
import { Field } from "@/components/common/field";
import { FormError } from "@/components/common/form-error";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/common/modal";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { useFormAction } from "@/hooks/use-form-action";
import type { ActionState } from "@/lib/action-state";

type PasswordAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/** Bottone che apre il cambio password in una modale. */
export function ChangePassword({ action }: { action?: PasswordAction }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="outline" className="h-11">
          <KeyRoundIcon aria-hidden />
          Cambia password
        </Button>
      </ModalTrigger>
      <ModalContent>
        <div className="mx-auto grid w-full max-w-md gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <ModalHeader className="px-0 text-left">
            <ModalTitle>Cambia password</ModalTitle>
            <ModalDescription>Serve la password attuale.</ModalDescription>
          </ModalHeader>
          {/* Montato solo da aperto: a ogni apertura riparte da un form vuoto. */}
          {open && <ChangePasswordForm action={action} onDone={() => setOpen(false)} />}
        </div>
      </ModalContent>
    </Modal>
  );
}

function ChangePasswordForm({
  action = changePassword,
  onDone,
}: {
  action?: PasswordAction;
  onDone?: () => void;
}) {
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      toast.success("Password aggiornata");
      onDone?.();
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label="Password attuale" name="currentPassword" type="password" autoComplete="current-password" required />
      <Field
        label="Nuova password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        minLength={10}
        hint="Almeno 10 caratteri."
        required
      />
      <Field label="Ripeti la nuova password" name="confirmPassword" type="password" autoComplete="new-password" required />
      <FormError message={state.error} />
      <SubmitButton pending={pending} variant="outline">
        Cambia password
      </SubmitButton>
    </form>
  );
}
