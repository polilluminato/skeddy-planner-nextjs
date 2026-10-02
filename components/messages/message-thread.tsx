"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronUpIcon, Trash2Icon } from "lucide-react";
import { deleteMessage, markMessagesRead } from "@/actions/messages";
import { ConfirmAction } from "@/components/common/confirm-action";
import { Button } from "@/components/ui/button";
import type { TimelineItem } from "@/lib/domain/messages";
import { cn } from "@/lib/utils";

type Props = {
  items: TimelineItem[];
  firstUnreadId: string | null;
  olderHref: string | null;
  isAdmin: boolean;
};

const NEAR_BOTTOM_PX = 120;

function scrollToBottom(behavior: ScrollBehavior = "instant") {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
}

export function MessageThread({ items, firstUnreadId, olderHref, isAdmin }: Props) {
  const router = useRouter();
  // Il separatore resta dov'era anche dopo il refresh che segna tutto come letto.
  const [unreadAnchor] = useState(firstUnreadId);
  const anchorRef = useRef<HTMLLIElement>(null);
  const nearBottom = useRef(true);
  const mounted = useRef(false);

  const messages = items.filter((i) => i.kind === "message");
  const last = messages.at(-1);
  const lastId = last?.id ?? null;
  const lastMine = last?.mine ?? false;
  const hasUnread = firstUnreadId !== null;

  useEffect(() => {
    const onScroll = () => {
      const { scrollHeight } = document.documentElement;
      nearBottom.current = window.innerHeight + window.scrollY >= scrollHeight - NEAR_BOTTOM_PX;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // All'apertura: ai nuovi messaggi se ci sono, altrimenti in fondo. Al frame successivo,
  // dopo lo scroll che il router applica alla navigazione.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (anchorRef.current) anchorRef.current.scrollIntoView({ block: "center" });
      else scrollToBottom();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Messaggi nuovi: in fondo solo se si era già lì o se l'ultimo l'ho scritto io.
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (nearBottom.current || lastMine) scrollToBottom("smooth");
  }, [lastId, lastMine]);

  useEffect(() => {
    if (!hasUnread) return;
    let cancelled = false;
    markMessagesRead().then((result) => {
      if (!cancelled && result.ok) router.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [hasUnread, lastId, router]);

  if (messages.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
        <h1 className="sr-only">Notifiche</h1>
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <BellIcon className="size-6" aria-hidden />
        </span>
        <p className="font-semibold">Nessuna notifica</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {isAdmin
            ? "Scrivi il primo messaggio per tutto il team."
            : "Qui troverai le comunicazioni degli amministratori."}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col justify-end gap-3 px-4 py-4 desktop:px-8">
      <h1 className="sr-only">Notifiche</h1>
      {olderHref && (
        <Link
          href={olderHref}
          scroll={false}
          className="mx-auto flex h-11 items-center gap-1 rounded-full px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronUpIcon className="size-4" aria-hidden />
          Messaggi precedenti
        </Link>
      )}
      <ol aria-label="Messaggi" className="grid gap-3">
        {items.map((item) => {
          if (item.kind === "day") {
            return (
              <li key={item.key} className="flex justify-center pt-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </li>
            );
          }
          const isAnchor = item.id === unreadAnchor;
          return (
            <li key={item.key} ref={isAnchor ? anchorRef : undefined} className="grid gap-3">
              {isAnchor && (
                <p className="flex items-center gap-3 text-xs font-semibold text-primary">
                  <span className="h-px flex-1 bg-primary/40" aria-hidden />
                  Nuovi messaggi
                  <span className="h-px flex-1 bg-primary/40" aria-hidden />
                </p>
              )}
              <MessageBubble item={item} canDelete={isAdmin} />
            </li>
          );
        })}
      </ol>
    </main>
  );
}

function MessageBubble({
  item,
  canDelete,
}: {
  item: Extract<TimelineItem, { kind: "message" }>;
  canDelete: boolean;
}) {
  return (
    <article className={cn("grid gap-1", item.mine ? "justify-items-end" : "justify-items-start")}>
      <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
        <span
          className={cn("size-2 shrink-0 rounded-full", !item.authorColor && "bg-muted-foreground/40")}
          style={item.authorColor ? { background: item.authorColor } : undefined}
          aria-hidden
        />
        <span className="font-medium text-foreground">{item.mine ? "Tu" : item.authorName}</span>
        <span aria-hidden>·</span>
        <time dateTime={item.sentAt} className="tabular-nums">
          {item.time}
        </time>
      </p>
      <div className={cn("flex max-w-[85%] items-end gap-1 desktop:max-w-[min(85%,42rem)]", item.mine && "flex-row-reverse")}>
        <p
          className={cn(
            "min-w-0 rounded-2xl px-3.5 py-2.5 break-words whitespace-pre-wrap",
            item.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card",
          )}
        >
          {item.body}
        </p>
        {canDelete && (
          <ConfirmAction
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-11 shrink-0 text-muted-foreground"
                aria-label="Elimina messaggio"
              >
                <Trash2Icon aria-hidden />
              </Button>
            }
            title="Eliminare il messaggio?"
            description="Sparirà per tutto il team."
            confirmLabel="Elimina"
            action={() => deleteMessage(item.id)}
            successMessage="Messaggio eliminato"
          />
        )}
      </div>
    </article>
  );
}
