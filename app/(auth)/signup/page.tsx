import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Registra la tua azienda" };

// Nessun redirect se autenticati: dopo la registrazione la pagina deve mostrare i codici
// anche se l'azione ha appena creato la sessione (che provoca un refresh della route).
export default function SignupPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Registra la tua azienda</h1>
        <p className="text-muted-foreground">
          Diventerai il primo amministratore. Riceverai il codice azienda e il tuo codice personale.
        </p>
      </div>
      <SignupForm />
      <p className="border-t pt-5 text-center text-sm text-muted-foreground">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Accedi
        </Link>
      </p>
    </div>
  );
}
