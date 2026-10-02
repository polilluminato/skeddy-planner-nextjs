"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatLongDay } from "@/lib/domain/format";
import { useShiftEditor } from "./shift-editor";

export function AddShiftButton({
  date,
  userId,
  variant = "inline",
}: {
  date: string;
  userId?: string;
  variant?: "inline" | "fab";
}) {
  const editor = useShiftEditor();
  if (!editor) return null;

  if (variant === "fab") {
    return (
      <Button
        onClick={() => editor.open({ date, userId })}
        className="fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 h-14 rounded-full px-5 text-base shadow-lg desktop:right-6 desktop:bottom-6"
      >
        <PlusIcon className="size-5" aria-hidden />
        Nuovo turno
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 shrink-0"
      onClick={() => editor.open({ date, userId })}
      aria-label={`Aggiungi turno ${formatLongDay(date)}`}
    >
      <PlusIcon className="size-5" aria-hidden />
    </Button>
  );
}
