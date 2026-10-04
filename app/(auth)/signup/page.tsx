import type { Metadata } from "next";
import Link from "next/link";
import { OrganizationSignupForm } from "@/components/auth/organization-signup-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Stesse tab della pagina di accesso.
const TRIGGER =
  "h-10! text-muted-foreground! hover:text-foreground! data-active:text-foreground! dark:data-active:border-transparent! dark:data-active:bg-background!";

export const metadata: Metadata = { title: "Registra la tua azienda" };

// Nessun redirect se autenticati: dopo la registrazione la pagina deve mostrare i codici
// anche se l'azione ha appena creato la sessione (che provoca un refresh della route).
export default function SignupPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Registra la tua azienda</h1>
      </div>
      <Tabs defaultValue="single" className="gap-5">
        <TabsList className="grid h-12! w-full grid-cols-2 p-1!">
          <TabsTrigger value="single" className={TRIGGER}>
            Un negozio
          </TabsTrigger>
          <TabsTrigger value="multi" className={TRIGGER}>
            Più negozi
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="grid gap-4">
          <p className="text-muted-foreground">
            Diventerai il primo amministratore. Riceverai il codice azienda e il tuo codice personale.
          </p>
          <SignupForm />
        </TabsContent>
        <TabsContent value="multi" className="grid gap-4">
          <p className="text-muted-foreground">
            Per l&apos;amministrazione centrale: crei e gestisci i turni di tutti i negozi da un solo account.
          </p>
          <OrganizationSignupForm />
        </TabsContent>
      </Tabs>
      <p className="border-t pt-5 text-center text-sm text-muted-foreground">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Accedi
        </Link>
      </p>
    </div>
  );
}
