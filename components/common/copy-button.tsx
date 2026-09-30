"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copiato negli appunti");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copia non riuscita: seleziona il testo a mano.");
    }
  }

  return (
    <Button type="button" variant="outline" size="icon" className="size-11 shrink-0" onClick={copy} aria-label={label}>
      {copied ? <CheckIcon className="size-5" aria-hidden /> : <CopyIcon className="size-5" aria-hidden />}
    </Button>
  );
}
