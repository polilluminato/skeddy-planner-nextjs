"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatLongDay } from "@/lib/domain/format";
import { cn } from "@/lib/utils";
import { useShiftEditor } from "./shift-editor";

export function AddShiftButton({
  date,
  userId,
  variant = "inline",
  label,
}: {
  date: string;
  userId?: string;
  variant?: "inline" | "fab";
  label?: string;
}) {
  const editor = useShiftEditor();
  if (!editor) return null;

  if (variant === "fab") {
    return (
      <Button
        onClick={() => editor.open({ date, userId })}
        className={cn(
          "fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 h-14 rounded-full px-5 text-base shadow-lg",
        )}
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
      aria-label={label ?? `Aggiungi turno ${formatLongDay(date)}`}
    >
      <PlusIcon className="size-5" aria-hidden />
    </Button>
  );
}
