"use client";

import { useRouter } from "next/navigation";
import { ShieldCheckIcon, ShieldOffIcon, Trash2Icon } from "lucide-react";
import { deleteEmployee, setEmployeeRole } from "@/actions/employees";
import { ConfirmAction } from "@/components/common/confirm-action";
import { Button } from "@/components/ui/button";
import { MAX_ADMINS } from "@/config/app";

type Props = {
  employeeId: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE";
  canPromote: boolean;
};

export function RoleAction({ employeeId, name, role, canPromote }: Props) {
  if (role === "ADMIN") {
    return (
      <ConfirmAction
        trigger={
          <Button variant="outline" className="h-11 w-full justify-start text-base">
            <ShieldOffIcon aria-hidden />
            Rimuovi da amministratore
          </Button>
        }
        title="Rimuovere i permessi?"
        description={`${name} tornerà a essere un dipendente: vedrà il calendario ma non potrà modificarlo.`}
        confirmLabel="Rimuovi"
        destructive={false}
        action={() => setEmployeeRole(employeeId, "EMPLOYEE")}
        successMessage="Permessi rimossi"
      />
    );
  }
  return (
    <ConfirmAction
      trigger={
        <Button variant="outline" className="h-11 w-full justify-start text-base" disabled={!canPromote}>
          <ShieldCheckIcon aria-hidden />
          {canPromote ? "Rendi amministratore" : `Massimo ${MAX_ADMINS} amministratori raggiunto`}
        </Button>
      }
      title="Nominare amministratore?"
      description={`${name} potrà gestire dipendenti e turni. Puoi avere al massimo ${MAX_ADMINS} amministratori.`}
      confirmLabel="Conferma"
      destructive={false}
      action={() => setEmployeeRole(employeeId, "ADMIN")}
      successMessage={`${name} è ora amministratore`}
    />
  );
}

export function DeleteMember({ employeeId, name }: { employeeId: string; name: string }) {
  const router = useRouter();
  return (
    <ConfirmAction
      trigger={
        <Button variant="destructive" className="h-11 w-full justify-start text-base">
          <Trash2Icon aria-hidden />
          Elimina dipendente
        </Button>
      }
      title={`Eliminare ${name}?`}
      description="Verranno eliminati anche tutti i suoi turni. L'operazione non si può annullare."
      confirmLabel="Elimina"
      action={() => deleteEmployee(employeeId)}
      successMessage="Dipendente eliminato"
      onDone={() => router.replace("/team")}
    />
  );
}
