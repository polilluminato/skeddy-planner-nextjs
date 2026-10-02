"use client";

import { useState } from "react";
import { Loader2Icon, SendIcon } from "lucide-react";
import { sendMessage } from "@/actions/messages";
import { FormError } from "@/components/common/form-error";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_MESSAGE_LENGTH } from "@/config/app";
import { useFormAction } from "@/hooks/use-form-action";

const COUNTER_FROM = MAX_MESSAGE_LENGTH - 100;

/** Barra di scrittura per gli amministratori, fissata sopra la navigazione. */
export function MessageComposer() {
  const [text, setText] = useState("");
  const { state, onSubmit, pending } = useFormAction(async (prev, formData) => {
    const result = await sendMessage(prev, formData);
    if (result.ok) setText("");
    return result;
  });
  const empty = text.trim() === "";

  return (
    <div className="sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <form onSubmit={onSubmit} className="grid gap-2">
        <FormError message={state.error} />
        <div className="flex items-end gap-2">
          <label htmlFor="message-body" className="sr-only">
            Messaggio per tutto il team
          </label>
          <Textarea
            id="message-body"
            name="body"
            rows={1}
            value={text}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Invio va a capo; Ctrl/Cmd+Invio invia (tastiere fisiche).
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !empty) e.currentTarget.form?.requestSubmit();
            }}
            placeholder="Scrivi a tutto il team…"
            className="max-h-40 min-h-11 resize-none rounded-2xl px-3.5 py-2.5 text-base md:text-base"
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0 rounded-full"
            disabled={pending || empty}
            aria-busy={pending}
            aria-label="Invia"
          >
            {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <SendIcon aria-hidden />}
          </Button>
        </div>
        {text.length > COUNTER_FROM && (
          <p className="px-1 text-xs text-muted-foreground tabular-nums" aria-live="polite">
            Restano {MAX_MESSAGE_LENGTH - text.length} caratteri
          </p>
        )}
      </form>
    </div>
  );
}
