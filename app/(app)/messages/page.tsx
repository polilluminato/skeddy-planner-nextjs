import type { Metadata } from "next";
import { AutoRefresh } from "@/components/common/auto-refresh";
import { MessageComposer } from "@/components/messages/message-composer";
import { MessageThread } from "@/components/messages/message-thread";
import { AppHeader } from "@/components/nav/app-header";
import { MESSAGES_PAGE_SIZE } from "@/config/app";
import { requireUser } from "@/lib/auth/guards";
import { buildTimeline, firstUnreadId, parseMessageLimit } from "@/lib/domain/messages";
import { getMessages } from "@/lib/queries";

export const metadata: Metadata = { title: "Messaggi" };

export default async function MessagesPage({ searchParams }: PageProps<"/messages">) {
  const { user, meId, isSupervisor, company, companyId, isAdmin } = await requireUser();
  const limit = parseMessageLimit((await searchParams).n);
  const { messages, hasMore } = await getMessages(companyId, limit);

  return (
    <>
      <AppHeader title="Messaggi" subtitle={company.name} />
      {/* Altezza del viewport meno header e bottom nav (solo header con la sidebar): pochi messaggi restano in basso, come in una chat. */}
      <div className="mx-auto flex min-h-[calc(100dvh-7rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-w-2xl desktop:min-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] desktop:max-w-none flex-col">
        <MessageThread
          items={buildTimeline(messages, { meId, isSupervisor })}
          firstUnreadId={user && firstUnreadId(messages, user.messagesReadAt, user.id)}
          olderHref={hasMore ? `/messages?n=${limit + MESSAGES_PAGE_SIZE}` : null}
          isAdmin={isAdmin}
        />
        {isAdmin ? (
          <MessageComposer />
        ) : (
          <p className="px-4 pb-4 text-center text-xs text-muted-foreground">
            Solo gli amministratori possono scrivere qui.
          </p>
        )}
      </div>
      <AutoRefresh intervalMs={60_000} />
    </>
  );
}
