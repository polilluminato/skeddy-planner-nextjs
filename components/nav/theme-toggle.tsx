"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const noopSubscribe = () => () => {};

/** true solo dopo l'idratazione: il tema salvato è noto soltanto sul client. */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Switch chiaro/scuro; l'etichetta che lo avvolge porta l'area di tocco a 44px. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";
  return (
    <label className="flex h-11 cursor-pointer items-center gap-1.5 px-1.5">
      <SunIcon className="size-4 text-foreground dark:text-muted-foreground" aria-hidden />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Tema scuro"
      />
      <MoonIcon className="size-4 text-muted-foreground dark:text-foreground" aria-hidden />
    </label>
  );
}
