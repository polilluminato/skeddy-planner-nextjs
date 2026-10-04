import type { Metadata } from "next";
import Link from "next/link";
import { CodeLoginForm } from "@/components/auth/code-login-form";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

// Stesso aspetto dello switch Giorno/Settimana del calendario (`components/calendar/toolbar.tsx`).
const TRIGGER =
  "h-10! text-muted-foreground! hover:text-foreground! data-active:text-foreground! dark:data-active:border-transparent! dark:data-active:bg-background!";

export const metadata: Metadata = { title: "Accedi" };

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Accedi</h1>
        <p className="text-muted-foreground">I turni della tua azienda, sempre a portata di mano.</p>
      </div>
      <Tabs defaultValue="codes" className="gap-5">
        <TabsList className="grid h-12! w-full grid-cols-2 p-1!">
          <TabsTrigger value="codes" className={TRIGGER}>
            Con i codici
          </TabsTrigger>
          <TabsTrigger value="email" className={TRIGGER}>
            Con email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="codes">
          <CodeLoginForm />
        </TabsContent>
        <TabsContent value="email">
          <EmailLoginForm />
          <p className="mt-3 text-xs text-muted-foreground">
            Per chi ha registrato l&apos;azienda e per l&apos;Amministrazione. Tutti i dipendenti entrano con i codici.
          </p>
        </TabsContent>
      </Tabs>
      <p className="border-t pt-5 text-center text-sm text-muted-foreground">
        Nuova azienda?{" "}
        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
          Registrati
        </Link>
      </p>
    </div>
  );
}
