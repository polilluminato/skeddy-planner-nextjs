import Link from "next/link";
import type { ReactNode } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/common/logo";
import {
  AccessMockup,
  CalendarMockup,
  DashboardMockup,
  HoursMockup,
  MessagesMockup,
  PhoneMockup,
  StoresMockup,
} from "@/components/landing/mockups";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/config/app";
import { redirectIfAuthenticated } from "@/lib/auth/guards";
import { cn } from "@/lib/utils";

/** Funzioni principali, a righe alterne testo/grafica come nelle landing di prodotto. */
const FEATURES = [
  {
    eyebrow: "Calendario",
    title: "Chi lavora e quando, a colpo d'occhio",
    text: "Vista giorno, settimana e mese. Da computer una griglia oraria con i turni affiancati, dal telefono l'elenco della giornata.",
    points: ["Un colore per ogni persona", "Nessuna sovrapposizione per lo stesso dipendente", "Export CSV e stampa"],
    visual: <CalendarMockup />,
  },
  {
    eyebrow: "Ore",
    title: "Ore pianificate contro ore previste",
    text: "Imposti le ore settimanali di ogni persona e Skeddy ti dice subito chi è sotto, in linea o oltre.",
    points: ["Riepilogo per persona, settimana per settimana", "Avvisi a colori, senza fogli di calcolo"],
    visual: <HoursMockup />,
  },
  {
    eyebrow: "Accesso",
    title: "Entrano con due codici, senza email né password",
    text: "Il codice azienda è fatto di quattro parole facili da dettare; il codice personale lo vede solo chi lo riceve.",
    points: ["Pronto in un minuto per tutto il team", "Codice personale mostrato una volta sola e salvato cifrato"],
    visual: <AccessMockup />,
  },
  {
    eyebrow: "Messaggi",
    title: "Un canale per tutta l'azienda",
    text: "Gli amministratori scrivono, tutti leggono dal telefono. I messaggi non letti sono evidenziati.",
    points: ["Niente gruppi WhatsApp con numeri personali", "Comunicazioni separate dalle chiacchiere"],
    visual: <MessagesMockup />,
  },
  {
    eyebrow: "Più negozi",
    title: "Un account per tutti i tuoi punti vendita",
    text: "Con l'Amministrazione passi da un negozio all'altro e gestisci turni e team di ciascuno dallo stesso posto.",
    points: ["Team separati, un solo accesso", "Fino a 3 amministratori per negozio"],
    visual: <StoresMockup />,
  },
];

const BEFORE = [
  "Turni su un foglio Excel mandato in foto",
  "Cambi comunicati a voce o nel gruppo WhatsApp",
  "Ore contate a mano a fine mese",
];
const AFTER = [
  "Turni sempre aggiornati sul telefono di tutti",
  "Avvisi in un canale ufficiale dell'azienda",
  "Ore della settimana calcolate in automatico",
];

const STEPS = [
  { title: "Registra l'azienda", text: "Crei l'account e ricevi il codice azienda di quattro parole." },
  { title: "Aggiungi il team", text: "Inserisci le persone con le ore settimanali: a ognuna un codice personale." },
  { title: "Pubblica i turni", text: "Disegni la settimana sul calendario e tutti la vedono subito dal telefono." },
];

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0 });

/** Piani: il secondo è quello in evidenza (card scura, come il "featured tier" di `docs/design.md`). */
const PLANS = [
  {
    name: "Gratis",
    price: euro.format(0),
    period: "per sempre",
    note: "Fino a 3 utenti",
    features: ["Calendario dei turni", "Accesso con codici", "Messaggi al team", "Export CSV e stampa"],
    cta: "Inizia gratis",
    featured: false,
  },
  {
    name: "Team",
    price: euro.format(1),
    period: "a utente al mese",
    note: "Rinnovo annuale",
    features: ["Utenti illimitati", "Tutto quello del piano Gratis"],
    cta: "Scegli Team",
    featured: true,
  },
];

/** Landing pubblica: chi ha già una sessione va direttamente nella sua area. */
export default async function Home() {
  await redirectIfAuthenticated();
  return (
    <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)]">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" className="h-11 text-base">
            <Link href="/login">Accedi</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pt-10 pb-16 md:pt-20 md:pb-24">
          <div className="mx-auto grid max-w-3xl justify-items-center gap-5 text-center">
            <Eyebrow>Turni del personale</Eyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              I turni del tuo team, sempre a portata di mano.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
              {APP_DESCRIPTION} Pianifica i turni, controlla le ore e avvisa tutti con un messaggio.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild className="h-11 px-5 text-base">
                <Link href="/signup">Registra la tua azienda</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-5 text-base">
                <Link href="/login">Accedi</Link>
              </Button>
            </div>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {["Gratis fino a 3 utenti", "Nessuna app da installare", "Da telefono e computer"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon className="size-4" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <DashboardMockup className="hidden md:block" />
            <PhoneMockup className="mx-auto md:absolute md:-right-2 md:-bottom-10 lg:-right-8" />
          </div>
        </section>

        <section aria-labelledby="problem-title" className="border-y bg-muted">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:py-24">
            <SectionTitle id="problem-title" eyebrow="Il problema" title="Basta turni dispersi tra fogli e chat." />
            <div className="grid gap-4 md:grid-cols-2">
              <CompareCard title="Senza Skeddy" items={BEFORE} icon={XIcon} />
              <CompareCard title="Con Skeddy" items={AFTER} icon={CheckIcon} highlighted />
            </div>
          </div>
        </section>

        <section aria-labelledby="steps-title" className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:py-24">
          <SectionTitle id="steps-title" eyebrow="Come funziona" title="Operativi in tre passaggi." />
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid content-start gap-3 rounded-xl border bg-card p-6">
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="features-title" className="mx-auto grid w-full max-w-6xl gap-16 px-4 pb-16 md:gap-24 md:pb-24">
          <h2 id="features-title" className="sr-only">
            Cosa puoi fare
          </h2>
          {FEATURES.map((feature, i) => (
            <article key={feature.eyebrow} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className={cn("grid content-start gap-4", i % 2 === 1 && "md:order-2")}>
                <Eyebrow>{feature.eyebrow}</Eyebrow>
                <h3 className="text-3xl font-semibold tracking-tight text-balance">{feature.title}</h3>
                <p className="text-lg text-muted-foreground text-pretty">{feature.text}</p>
                <ul className="grid gap-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckIcon className="mt-1 size-4 shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0">{feature.visual}</div>
            </article>
          ))}
        </section>

        <div className="border-t bg-muted">
          <div className="mx-auto grid w-full max-w-6xl gap-16 px-4 py-16 md:py-24">
            <section aria-labelledby="pricing-title" className="grid gap-6">
              <div className="grid gap-2">
                <h2 id="pricing-title" className="font-heading text-3xl font-semibold tracking-tight">
                  Prezzi
                </h2>
                <p className="text-muted-foreground">Inizia gratis, passa a Team quando il gruppo cresce.</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {PLANS.map((plan) => (
                  <li
                    key={plan.name}
                    className={cn(
                      "grid content-start gap-6 rounded-xl p-6 sm:p-8",
                      plan.featured ? "border border-transparent bg-surface-dark text-on-dark" : "border bg-card",
                    )}
                  >
                    <div className="grid gap-1">
                      <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
                      <p className={cn("text-sm", plan.featured ? "text-on-dark-soft" : "text-muted-foreground")}>
                        {plan.note}
                      </p>
                    </div>
                    <p className="flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-semibold tracking-tight">{plan.price}</span>
                      <span className={cn("text-sm", plan.featured ? "text-on-dark-soft" : "text-muted-foreground")}>
                        {plan.period}
                      </span>
                    </p>
                    <ul className="grid gap-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckIcon className="size-4 shrink-0" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.featured ? (
                      // Bottone chiaro sulla card scura: i varianti di `Button` presuppongono uno sfondo chiaro.
                      <Link
                        href="/signup"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-on-dark px-5 text-base font-semibold text-surface-dark transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark"
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <Button asChild variant="outline" className="h-11 px-5 text-base">
                        <Link href="/signup">{plan.cta}</Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid justify-items-center gap-5 rounded-xl border-2 border-dashed bg-background px-6 py-12 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance">
                Pronto a organizzare la prossima settimana?
              </h2>
              <p className="text-muted-foreground">Registra l’azienda in un minuto, è gratis fino a 3 utenti.</p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild className="h-11 px-5 text-base">
                  <Link href="/signup">Registra la tua azienda</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-5 text-base">
                  <Link href="/login">Accedi</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-surface-dark pb-[env(safe-area-inset-bottom)] text-sm text-on-dark-soft">
        <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-12">
          <Logo className="text-on-dark" />
          <p>{APP_DESCRIPTION}</p>
        </div>
      </footer>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </span>
  );
}

function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="grid justify-items-start gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function CompareCard({
  title,
  items,
  icon: Icon,
  highlighted,
}: {
  title: string;
  items: string[];
  icon: typeof CheckIcon;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid content-start gap-4 rounded-xl p-6 sm:p-8",
        highlighted ? "bg-surface-dark text-on-dark" : "border bg-card",
      )}
    >
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Icon
              className={cn("mt-1 size-4 shrink-0", highlighted ? "text-on-dark" : "text-muted-foreground")}
              aria-hidden
            />
            <span className={highlighted ? undefined : "text-muted-foreground"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
