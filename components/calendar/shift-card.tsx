"use client";

import { ChevronRightIcon } from "lucide-react";
import { formatMinutes, shiftMinutes } from "@/lib/domain/shifts";
import { cn } from "@/lib/utils";
import { useShiftEditor } from "./shift-editor";
import { memberName, type CalendarMember, type CalendarShift } from "./types";

type Props = {
  shift: CalendarShift;
  member: CalendarMember;
  isMine: boolean;
  canEdit: boolean;
};

export function ShiftCard({ shift, member, isMine, canEdit }: Props) {
  const editor = useShiftEditor();
  const name = memberName(member);
  const duration = formatMinutes(shiftMinutes(shift));

  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="flex items-baseline gap-2">
          <span className="font-semibold tabular-nums">
            {shift.start}–{shift.end}
          </span>
          <span className="text-xs text-white/80 tabular-nums">{duration}</span>
        </span>
        <span className="mt-0.5 flex min-w-0 items-center text-sm">
          <span className="truncate font-medium">{name}</span>
          {isMine && <span className="ml-1.5 shrink-0 text-xs font-semibold">(tu)</span>}
        </span>
        {shift.note && <span className="truncate text-xs text-white/80">{shift.note}</span>}
      </span>
      {canEdit && <ChevronRightIcon className="size-4 shrink-0 text-white/80" aria-hidden />}
    </>
  );

  const className = cn(
    "flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-white [print-color-adjust:exact]",
    isMine && "ring-2 ring-primary/40",
  );
  const style = { background: member.color };

  if (!canEdit || !editor) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={cn(className, "transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-ring")}
      style={style}
      onClick={() => editor.open({ shift, date: shift.date })}
      aria-label={`Modifica turno di ${name}, ${shift.start}–${shift.end}`}
    >
      {content}
    </button>
  );
}
