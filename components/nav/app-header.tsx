import { LogoMark } from "@/components/common/logo";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
        <LogoMark className="size-7 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{title}</p>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
