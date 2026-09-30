import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/nav/theme-toggle";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-10">{children}</main>
    </div>
  );
}
