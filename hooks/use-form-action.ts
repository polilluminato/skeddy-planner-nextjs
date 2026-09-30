"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { ActionState } from "@/lib/action-state";

/**
 * useActionState con submit via onSubmit + startTransition:
 * a differenza di `action={...}`, React non svuota il form quando l'azione restituisce un errore.
 */
export function useFormAction<S extends ActionState>(
  action: (prev: Awaited<S>, formData: FormData) => Promise<S>,
  initial: Awaited<S> = {} as Awaited<S>,
) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return { state, onSubmit, pending };
}
