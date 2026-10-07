import type { ReactNode } from "react";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  MessagesSquareIcon,
  StoreIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import { HoursBar, HoursStatusText } from "@/components/calendar/hours-summary";
import { tint } from "@/components/calendar/types";
import { LogoMark } from "@/components/common/logo";
import { MemberChip } from "@/components/common/member-chip";
import { EMPLOYEE_COLORS } from "@/config/colors";
import type { HoursRow } from "@/lib/domain/schedule";
import { cn } from "@/lib/utils";

/*
 * Grafiche della landing: frammenti statici dell'app con dati finti, solo decorativi
 * (il testo accanto descrive già la funzione). Stessi token e colori del calendario vero.
 */

const [blue, teal, ochre, magenta, slate] = EMPLOYEE_COLORS.map((c) => c.value);

const PEOPLE = [
  { name: "Giulia Rossi", color: blue },
  { name: "Marco Bianchi", color: teal },
  { name: "Sara Conti", color: magenta },
  { name: "Luca Ferri", color: ochre },
];

const DAYS = [
  { label: "Lun", day: 13 },
  { label: "Mar", day: 14 },
  { label: "Mer", day: 15, today: true },
  { label: "Gio", day: 16 },
  { label: "Ven", day: 17 },
];

/**
 * Turni della settimana finta: [giorno, persona, inizio, fine] in ore (griglia 8–20) e, per i turni
 * sovrapposti, la metà di colonna (0 sinistra, 1 destra) come la disporrebbe la griglia vera.
 */
const WEEK: [number, number, number, number, (0 | 1)?][] = [
  [0, 0, 8, 14],
  [0, 1, 14, 20],
  [1, 2, 9, 13],
  [1, 0, 13, 19],
  [2, 1, 8, 14, 0],
  [2, 3, 10, 16, 1],
  [2, 2, 15, 20, 0],
  [3, 0, 8, 12],
  [3, 3, 12, 18],
  [4, 2, 8, 14],
  [4, 1, 14, 20],
];
const FROM = 8;
const TO = 20;

/** Cornice "finestra" per i mockup desktop. */
export function BrowserFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn("overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/10", className)}>
      <div className="flex h-9 items-center gap-1.5 border-b bg-muted px-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="mx-auto h-4 w-1/3 rounded-md bg-background" />
      </div>
      {children}
    </div>
  );
}

/** Cornice "telefono" per i mockup della vista dipendente. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-64 overflow-hidden rounded-[2.25rem] border-[6px] border-foreground/90 bg-background shadow-2xl shadow-black/20",
        className,
      )}
    >
      <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-foreground/90" />
      {children}
    </div>
  );
}

function WeekGrid({ className }: { className?: string }) {
  const hours = Array.from({ length: TO - FROM }, (_, i) => FROM + i);
  const columns = { gridTemplateColumns: `2.5rem repeat(${DAYS.length}, minmax(0, 1fr))` };
  return (
    <div className={cn("text-[0.6875rem]", className)}>
      <div className="grid border-b" style={columns}>
        <span />
        {DAYS.map((d) => (
          <span key={d.day} className="flex flex-col items-center gap-0.5 border-l py-1.5">
            <span className={cn("uppercase", d.today ? "text-foreground" : "text-muted-foreground")}>{d.label}</span>
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-sm font-semibold tabular-nums",
                d.today && "bg-primary text-primary-foreground",
              )}
            >
              {d.day}
            </span>
          </span>
        ))}
      </div>
      <div className="grid" style={columns}>
        <div className="relative">
          {hours.map((h, i) =>
            i % 2 === 0 && i > 0 ? (
              <span
                key={h}
                className="absolute right-1.5 -translate-y-1/2 text-muted-foreground tabular-nums"
                style={{ top: `${(i / hours.length) * 100}%` }}
              >
                {h}:00
              </span>
            ) : null,
          )}
        </div>
        {DAYS.map((d, dayIndex) => (
          <div
            key={d.day}
            className="relative h-60 border-l"
            style={{
              backgroundImage: "linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: `100% ${100 / hours.length}%`,
            }}
          >
            {WEEK.filter(([day]) => day === dayIndex).map(([, person, start, end, half], i) => {
              const p = PEOPLE[person];
              return (
                <div
                  key={i}
                  className="absolute px-0.5"
                  style={{
                    top: `${((start - FROM) / (TO - FROM)) * 100}%`,
                    height: `${((end - start) / (TO - FROM)) * 100}%`,
                    left: half ? "50%" : 0,
                    width: half === undefined ? "100%" : "50%",
                  }}
                >
                  <div
                    className="h-full overflow-hidden rounded-md border border-card px-1.5 py-1 leading-tight text-white"
                    style={{ background: p.color }}
                  >
                    <div className="font-semibold tabular-nums">
                      {start}–{end}
                    </div>
                    <div className="truncate">{p.name.split(" ")[0]}</div>
                  </div>
                </div>
              );
            })}
            {d.today && (
              <div className="absolute inset-x-0 z-10" style={{ top: "38%" }}>
                <span className="absolute -top-1 -left-1 size-2 rounded-full bg-primary" />
                <span className="block h-px bg-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const SIDEBAR = [
  { icon: CalendarDaysIcon, label: "Calendario", active: true },
  { icon: UsersIcon, label: "Team" },
  { icon: MessagesSquareIcon, label: "Messaggi" },
  { icon: UserRoundIcon, label: "Profilo" },
];

/** Hero: la dashboard dell'amministratore, con sidebar, ore della settimana e griglia. */
export function DashboardMockup({ className }: { className?: string }) {
  return (
    <BrowserFrame className={className}>
      <div className="flex">
        <aside className="hidden w-40 shrink-0 flex-col gap-1 border-r p-3 text-xs sm:flex">
          <span className="mb-3 flex items-center gap-1.5 font-semibold">
            <LogoMark className="size-5" />
            Skeddy
          </span>
          {SIDEBAR.map(({ icon: Icon, label, active }) => (
            <span
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5",
                active ? "bg-accent font-medium" : "text-muted-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </aside>
        <div className="grid min-w-0 flex-1 gap-3 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">13 – 17 ottobre</span>
            <span className="flex rounded-md border p-0.5 text-[0.6875rem]">
              <span className="px-2 py-0.5 text-muted-foreground">Giorno</span>
              <span className="rounded bg-accent px-2 py-0.5 font-medium">Settimana</span>
              <span className="px-2 py-0.5 text-muted-foreground">Mese</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {HOURS.map((row, i) => (
              <HoursCard key={row.userId} row={row} person={PEOPLE[i]} compact />
            ))}
          </div>
          <div className="rounded-lg border">
            <WeekGrid />
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Vista del dipendente sul telefono: i suoi prossimi turni. */
export function PhoneMockup({ className }: { className?: string }) {
  const shifts = [
    { day: "Oggi", date: "mer 15", time: "08:00–14:00", hours: "6 h" },
    { day: "Domani", date: "gio 16", time: "08:00–12:00", hours: "4 h" },
    { day: "Venerdì", date: "ven 17", time: "14:00–20:00", hours: "6 h" },
  ];
  return (
    <PhoneFrame className={className}>
      <div className="grid gap-3 px-4 pt-4 pb-6 text-xs">
        <div className="grid gap-0.5">
          <span className="text-muted-foreground">Ciao Giulia</span>
          <span className="text-base font-semibold tracking-tight">I tuoi prossimi turni</span>
        </div>
        {shifts.map((s) => (
          <div key={s.date} className="grid gap-1">
            <span className="font-medium text-muted-foreground">
              {s.day} · {s.date}
            </span>
            <div className="rounded-lg px-3 py-2 text-white ring-2 ring-primary/40" style={{ background: blue }}>
              <span className="font-semibold tabular-nums">{s.time}</span>
              <span className="ml-2 text-white/80">{s.hours}</span>
            </div>
          </div>
        ))}
        <div className="mt-1 flex justify-around border-t pt-3 text-muted-foreground">
          <CalendarDaysIcon className="size-4 text-foreground" />
          <MessagesSquareIcon className="size-4" />
          <UserRoundIcon className="size-4" />
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Ore della settimana finte, in minuti. */
const HOURS: HoursRow[] = [
  { userId: "1", planned: 21 * 60, target: 20 * 60, status: "over" },
  { userId: "2", planned: 18 * 60, target: 18 * 60, status: "ok" },
  { userId: "3", planned: 15 * 60, target: 24 * 60, status: "under" },
  { userId: "4", planned: 12 * 60, target: 12 * 60, status: "ok" },
];

function HoursCard({ row, person, compact }: { row: HoursRow; person: (typeof PEOPLE)[number]; compact?: boolean }) {
  return (
    <div className={cn("grid gap-1.5 rounded-lg border bg-card", compact ? "p-2 text-[0.6875rem]" : "p-4 text-sm")}>
      <span className="flex min-w-0">
        <MemberChip name={person.name} color={person.color} />
      </span>
      <span className="flex items-baseline gap-1 tabular-nums">
        <span className={cn("font-semibold tracking-tight", compact ? "text-sm" : "text-2xl")}>
          {row.planned / 60} h
        </span>
        <span className="text-muted-foreground">/ {row.target / 60} h</span>
      </span>
      <HoursBar row={row} color={person.color} />
      {!compact && <HoursStatusText row={row} />}
    </div>
  );
}

/** Funzione "ore": card per persona con lo stato rispetto alle ore previste. */
export function HoursMockup() {
  return (
    <div aria-hidden className="grid gap-3 sm:grid-cols-2">
      {HOURS.map((row, i) => (
        <HoursCard key={row.userId} row={row} person={PEOPLE[i]} />
      ))}
    </div>
  );
}

/** Funzione "calendario": la griglia settimanale da sola. */
export function CalendarMockup() {
  return (
    <BrowserFrame>
      <WeekGrid className="p-2" />
    </BrowserFrame>
  );
}

/** Funzione "accesso": codice azienda in parole e codice personale. */
export function AccessMockup() {
  return (
    <PhoneFrame className="mx-auto">
      <div className="grid gap-4 px-4 pt-6 pb-8 text-xs">
        <div className="flex flex-col items-center gap-2 text-center">
          <LogoMark className="size-9" />
          <span className="text-base font-semibold tracking-tight">Entra nel tuo team</span>
        </div>
        <div className="grid gap-1.5">
          <span className="font-medium">Codice azienda</span>
          <div className="grid grid-cols-2 gap-1.5">
            {["girasole", "tavolo", "nuvola", "biscotto"].map((w) => (
              <span key={w} className="rounded-md border bg-muted px-2 py-1.5 font-mono">
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-1.5">
          <span className="font-medium">Codice personale</span>
          <span className="rounded-md border px-2 py-2 font-mono tracking-[0.3em]">K7QM•••••</span>
        </div>
        <span className="grid h-9 place-items-center rounded-lg bg-primary font-semibold text-primary-foreground">
          Accedi
        </span>
      </div>
    </PhoneFrame>
  );
}

/** Funzione "messaggi": il canale aziendale scritto dagli amministratori. */
export function MessagesMockup() {
  const messages = [
    { author: "Giulia Rossi", color: blue, time: "09:12", text: "Sabato apriamo alle 8: inventario prima dell'apertura." },
    { author: "Giulia Rossi", color: blue, time: "09:14", text: "Turni della prossima settimana pubblicati ✅" },
    { author: "Marco Bianchi", color: teal, time: "16:40", text: "Lunedì alle 18 riunione di team in negozio." },
  ];
  return (
    <div aria-hidden className="grid gap-3 rounded-xl border bg-card p-4 shadow-2xl shadow-black/10">
      <div className="flex items-center justify-between border-b pb-3">
        <span className="font-semibold">Messaggi</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">3 nuovi</span>
      </div>
      {messages.map((m, i) => (
        <div key={i} className="grid gap-1 text-sm">
          <span className="flex items-center gap-2 text-xs">
            <MemberChip name={m.author} color={m.color} />
            <span className="text-muted-foreground tabular-nums">{m.time}</span>
          </span>
          <p className="w-fit max-w-[90%] rounded-xl rounded-tl-sm px-3 py-2" style={{ background: tint(m.color, 10) }}>
            {m.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Funzione "Amministrazione": un account, più negozi. */
export function StoresMockup() {
  const stores = [
    { name: "Negozio Centro", people: 8, color: blue, active: true },
    { name: "Negozio Stazione", people: 5, color: teal },
    { name: "Outlet Nord", people: 11, color: slate },
  ];
  return (
    <div aria-hidden className="grid gap-3 rounded-xl border bg-card p-4 shadow-2xl shadow-black/10">
      <span className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
        <span className="flex items-center gap-2 font-medium">
          <StoreIcon className="size-4" /> Negozio Centro
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </span>
      <ul className="grid gap-2">
        {stores.map((s) => (
          <li
            key={s.name}
            className={cn("flex items-center gap-3 rounded-lg p-3", s.active ? "bg-accent" : "border")}
          >
            <span className="grid size-9 place-items-center rounded-lg text-white" style={{ background: s.color }}>
              <StoreIcon className="size-4" />
            </span>
            <span className="grid flex-1 text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.people} persone</span>
            </span>
            {s.active && <span className="text-xs font-medium">Attivo</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
