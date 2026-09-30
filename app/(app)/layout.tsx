import { BottomNav } from "@/components/nav/bottom-nav";
import { requireUser } from "@/lib/auth/guards";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const { isAdmin } = await requireUser();
  return (
    <div className="min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}
