"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Senza notifiche push i dati si riprendono dal server: quando la pagina torna visibile
 * (`onVisible`) e/o a intervalli regolari mentre è visibile (`intervalMs`).
 */
export function AutoRefresh({ onVisible = false, intervalMs }: { onVisible?: boolean; intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (intervalMs && !timer) timer = setInterval(() => router.refresh(), intervalMs);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        if (onVisible) router.refresh();
        start();
      } else {
        stop();
      }
    }

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router, onVisible, intervalMs]);

  return null;
}
