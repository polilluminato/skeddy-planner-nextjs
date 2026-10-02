"use client";

import { useEffect } from "react";
import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Apre la stampa appena la pagina è pronta; il pulsante serve se il dialogo è stato chiuso. */
export function PrintButton() {
  useEffect(() => window.print(), []);
  return (
    <Button onClick={() => window.print()} className="h-11 print:hidden">
      <PrinterIcon aria-hidden />
      Stampa
    </Button>
  );
}
