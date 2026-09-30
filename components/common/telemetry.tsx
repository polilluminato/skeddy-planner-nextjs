"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import TelemetryDeck from "@telemetrydeck/sdk";

const USER_KEY = "skeddy-telemetry-user";

/** Id anonimo per dispositivo: nessun dato personale lascia il browser. */
function deviceUser(): string {
  try {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(USER_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

export function Telemetry({ appId, testMode }: { appId: string; testMode: boolean }) {
  const pathname = usePathname();
  const td = useRef<TelemetryDeck | null>(null);

  useEffect(() => {
    td.current ??= new TelemetryDeck({ appID: appId, clientUser: deviceUser(), testMode });
    td.current.signal("pageview", { path: pathname }).catch(() => {});
  }, [appId, testMode, pathname]);

  return null;
}
