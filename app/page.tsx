import Link from "next/link";
import { CalendarDaysIcon, ClockIcon, KeyRoundIcon, MessagesSquareIcon } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/config/app";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

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
