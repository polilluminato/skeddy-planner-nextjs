import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calendarHref, shiftPeriod, type CalendarState, type CalendarView } from "@/lib/domain/calendar";
import { formatLongDay, formatWeekRange } from "@/lib/domain/format";
import { cn } from "@/lib/utils";

const VIEW_LABELS: Record<CalendarView, string> = { day: "Giorno", week: "Settimana" };

function periodLabel({ view, date }: CalendarState): string {
  return view === "day" ? formatLongDay(date) : formatWeekRange(date);
}

export function CalendarToolbar({
  state,
  today,
  extraParams = "",
}: {
  state: CalendarState;
  today: string;
  extraParams?: string;
}) {
  const href = (s: CalendarState) => calendarHref(s) + extraParams;
  const prev = shiftPeriod(state, -1);
  const next = shiftPeriod(state, 1);

  return (
    <div className="grid gap-3 desktop:flex desktop:items-center desktop:gap-6">
      <nav aria-label="Vista calendario" className="grid grid-cols-2 rounded-lg bg-muted p-1 desktop:order-last desktop:w-80">
        {(Object.keys(VIEW_LABELS) as CalendarView[]).map((view) => {
          const active = view === state.view;
          return (
            <Link
              key={view}
              href={href({ view, date: state.date })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center justify-center rounded-md text-sm font-medium transition-colors",
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {VIEW_LABELS[view]}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1 desktop:flex-1">
        <Button asChild variant="ghost" size="icon" className="size-11">
          <Link href={href({ ...state, date: prev })} aria-label="Periodo precedente">
            <ChevronLeftIcon className="size-5" aria-hidden />
          </Link>
        </Button>
        <h2 className="flex-1 text-center font-semibold desktop:min-w-56 desktop:flex-none" aria-live="polite">
          {periodLabel(state)}
        </h2>
        <Button asChild variant="ghost" size="icon" className="size-11">
          <Link href={href({ ...state, date: next })} aria-label="Periodo successivo">
            <ChevronRightIcon className="size-5" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-3">
          <Link href={href({ ...state, date: today })}>Oggi</Link>
        </Button>
      </div>
    </div>
  );
}
