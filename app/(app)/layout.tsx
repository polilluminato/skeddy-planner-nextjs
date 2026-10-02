import { AutoRefresh } from "@/components/common/auto-refresh";
import { AppNav } from "@/components/nav/app-nav";
import { requireUser } from "@/lib/auth/guards";
import { countUnreadMessages } from "@/lib/queries";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { user, companyId, isAdmin } = await requireUser();
  const unread = await countUnreadMessages(companyId, user.messagesReadAt);
  return (
    // Solo gli admin hanno la vista desktop con sidebar (variante `desktop:`); i dipendenti restano sempre mobile.
    <div
      data-sidebar={isAdmin ? "" : undefined}
      className="min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))] desktop:pb-0 desktop:pl-60"
    >
      {children}
      <AppNav isAdmin={isAdmin} unread={unread} />
      {/* Riaprendo la PWA si riprendono turni e notifiche non lette. */}
      <AutoRefresh onVisible />
    </div>
  );
}
