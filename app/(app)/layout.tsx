import { AutoRefresh } from "@/components/common/auto-refresh";
import { BottomNav } from "@/components/nav/bottom-nav";
import { requireUser } from "@/lib/auth/guards";
import { countUnreadMessages } from "@/lib/queries";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { user, companyId, isAdmin } = await requireUser();
  const unread = await countUnreadMessages(companyId, user.messagesReadAt);
  return (
    <div className="min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav isAdmin={isAdmin} unread={unread} />
      {/* Riaprendo la PWA si riprendono turni e notifiche non lette. */}
      <AutoRefresh onVisible />
    </div>
  );
}
