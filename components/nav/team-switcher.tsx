"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { selectCompany } from "@/actions/organization";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/common/modal";
import { cn } from "@/lib/utils";

export type Team = { id: string; name: string };

const ROW = "flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm";

/**
 * Solo il cambio del negozio attivo per l'Amministrazione; la gestione dei negozi è in `/org`.
 * Va montato con `key` sul negozio attivo: dopo il cambio si rimonta chiuso.
 */
export function TeamSwitcher({
  teams,
  active,
  children,
}: {
  teams: Team[];
  active: Team;
  /** Il pulsante che apre la finestra. */
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {children}
      </ModalTrigger>
      <ModalContent>
        <div className="mx-auto w-full max-w-md pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <ModalHeader>
            <ModalTitle>Cambia negozio</ModalTitle>
            <ModalDescription>Scegli il negozio su cui lavorare.</ModalDescription>
          </ModalHeader>
          <ul className="mx-4 divide-y overflow-hidden rounded-lg border">
            {teams.map((team) =>
              team.id === active.id ? (
                <li key={team.id} aria-current="true" className={cn(ROW, "bg-accent/50 font-medium")}>
                  <span className="min-w-0 flex-1 truncate">{team.name}</span>
                  <CheckIcon className="size-4 shrink-0" aria-label="Attivo" />
                </li>
              ) : (
                <li key={team.id}>
                  <form action={selectCompany.bind(null, team.id)}>
                    <TeamButton name={team.name} />
                  </form>
                </li>
              ),
            )}
          </ul>
        </div>
      </ModalContent>
    </Modal>
  );
}

function TeamButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={cn(ROW, "transition-colors hover:bg-accent")}>
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {pending && <Loader2Icon className="size-4 shrink-0 animate-spin" aria-hidden />}
    </button>
  );
}
