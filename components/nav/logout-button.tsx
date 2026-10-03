"use client";

import { logout } from "@/actions/auth";
import { ConfirmAction } from "@/components/common/confirm-action";

/** Uscita con conferma: per un dipendente rientrare richiede il codice personale, mostrato una sola volta. */
export function LogoutButton({ trigger }: { trigger: React.ReactNode }) {
  return (
    <ConfirmAction
      trigger={trigger}
      title="Vuoi uscire?"
      description="Per rientrare ti serviranno il codice azienda e il tuo codice personale (o email e password, se le hai)."
      confirmLabel="Esci"
      action={async () => {
        await logout();
        return {};
      }}
    />
  );
}
