"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteShift, saveShift } from "@/actions/shifts";
import { DateField } from "@/components/common/date-field";
import { FormError } from "@/components/common/form-error";
import { SubmitButton } from "@/components/common/submit-button";
import { TimeField } from "@/components/common/time-field";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/hooks/use-form-action";
import { formatLongDay } from "@/lib/domain/format";
import { memberName, type CalendarMember, type CalendarShift } from "./types";

type Draft = { shift?: CalendarShift; date: string; userId?: string; start?: string; end?: string };

const EditorContext = createContext<{ open: (draft: Draft) => void } | null>(null);

export function useShiftEditor() {
  return useContext(EditorContext);
}

/** Un solo Drawer per tutta la pagina: i pulsanti "aggiungi"/"modifica" lo aprono via contesto. */
export function ShiftEditorProvider({
  members,
  children,
}: {
  members: CalendarMember[];
  children: React.ReactNode;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function open(next: Draft) {
    setDraft(next);
    setFormKey((k) => k + 1);
    setIsOpen(true);
  }

  return (
    <EditorContext.Provider value={{ open }}>
      {children}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          {draft && (
            <ShiftForm key={formKey} draft={draft} members={members} onDone={() => setIsOpen(false)} />
          )}
        </DrawerContent>
      </Drawer>
    </EditorContext.Provider>
  );
}

function ShiftForm({ draft, members, onDone }: { draft: Draft; members: CalendarMember[]; onDone: () => void }) {
  const editing = draft.shift;
  const action = saveShift.bind(null, editing?.id ?? null);
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await action(prev, formData);
    if (result.ok) {
      toast.success(editing ? "Turno aggiornato" : "Turno aggiunto");
      onDone();
    }
    return result;
  });
  const [deleting, startDelete] = useTransition();

  function remove() {
    if (!editing) return;
    startDelete(async () => {
      const result = await deleteShift(editing.id);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Turno eliminato");
        onDone();
      }
    });
  }

  const selectedUser = editing?.userId ?? draft.userId ?? "";

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md overflow-y-auto" noValidate>
      <DrawerHeader className="text-left">
        <DrawerTitle>{editing ? "Modifica turno" : "Nuovo turno"}</DrawerTitle>
        <DrawerDescription>{formatLongDay(editing?.date ?? draft.date)}</DrawerDescription>
      </DrawerHeader>

      <div className="grid gap-4 px-4">
        <div className="grid gap-1.5">
          <Label htmlFor="shift-user">Dipendente</Label>
          <select
            id="shift-user"
            name="userId"
            defaultValue={selectedUser}
            required
            className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="" disabled>
              Scegli…
            </option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {memberName(m)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="shift-date">Giorno</Label>
          <DateField id="shift-date" name="date" defaultValue={editing?.date ?? draft.date} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="shift-start">Inizio</Label>
            <TimeField id="shift-start" name="start" label="Inizio" defaultValue={editing?.start ?? draft.start ?? "09:00"} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="shift-end">Fine</Label>
            <TimeField id="shift-end" name="end" label="Fine" defaultValue={editing?.end ?? draft.end ?? "13:00"} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="shift-note">Nota (facoltativa)</Label>
          <Textarea
            id="shift-note"
            name="note"
            maxLength={200}
            rows={2}
            defaultValue={editing?.note ?? ""}
            placeholder="es. apertura, cassa…"
            className="text-base md:text-base"
          />
        </div>

        <FormError message={state.error} />
      </div>

      <DrawerFooter className="pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <SubmitButton pending={pending}>{editing ? "Salva modifiche" : "Aggiungi turno"}</SubmitButton>
        {editing && (
          <Button
            type="button"
            variant="destructive"
            className="h-11 text-base"
            onClick={remove}
            disabled={deleting || pending}
          >
            <Trash2Icon aria-hidden />
            {deleting ? "Eliminazione…" : "Elimina turno"}
          </Button>
        )}
      </DrawerFooter>
    </form>
  );
}
