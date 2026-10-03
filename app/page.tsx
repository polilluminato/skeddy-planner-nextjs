import Link from "next/link";
import { CalendarDaysIcon, CheckIcon, ClockIcon, KeyRoundIcon, MessagesSquareIcon } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/config/app";
import { redirectIfAuthenticated } from "@/lib/auth/guards";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: CalendarDaysIcon,
    title: "Calendario dei turni",
    text: "Giorno, settimana e mese: chi lavora e quando, a colpo d'occhio.",
  },
  {
    icon: KeyRoundIcon,
    title: "Accesso con due codici",
    text: "I dipendenti entrano con codice azienda e codice personale, senza email né password.",
  },
  {
    icon: ClockIcon,
    title: "Ore sotto controllo",
    text: "Ore pianificate e ore previste di ogni persona, settimana per settimana.",
  },
  {
    icon: MessagesSquareIcon,
    title: "Messaggi al team",
    text: "Gli amministratori scrivono a tutta l'azienda, tutti leggono dal telefono.",
  },
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
      <header className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-2 px-4">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" className="h-11 text-base">
            <Link href="/login">Accedi</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-4xl flex-1 content-start gap-14 px-4 pt-10 pb-16 md:pt-20">
        <section className="grid max-w-2xl gap-5">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            I turni del tuo team, sempre a portata di mano.
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            {APP_DESCRIPTION} Pianifica i turni, controlla le ore e avvisa tutti con un messaggio.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5 text-base">
              <Link href="/signup">Registra la tua azienda</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 text-base">
              <Link href="/login">Accedi</Link>
            </Button>
          </div>
        </section>

        <section aria-labelledby="features-title" className="grid gap-4">
          <h2 id="features-title" className="sr-only">
            Cosa puoi fare
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3 rounded-xl bg-secondary p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="grid gap-1">
                  <span className="font-semibold">{title}</span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

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
      </main>

      <footer className="bg-surface-dark pb-[env(safe-area-inset-bottom)] text-sm text-on-dark-soft">
        <div className="mx-auto grid w-full max-w-4xl gap-3 px-4 py-12">
          <Logo className="text-on-dark" />
          <p>{APP_DESCRIPTION}</p>
        </div>
      </footer>
    </div>
  );
}
