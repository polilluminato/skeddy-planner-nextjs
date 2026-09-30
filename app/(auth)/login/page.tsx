import type { Metadata } from "next";
import Link from "next/link";
import { CodeLoginForm } from "@/components/auth/code-login-form";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

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
        <TabsList className="grid h-11 w-full grid-cols-2">
          <TabsTrigger value="codes" className="h-9">
            Con i codici
          </TabsTrigger>
          <TabsTrigger value="email" className="h-9">
            Con email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="codes">
          <CodeLoginForm />
        </TabsContent>
        <TabsContent value="email">
          <EmailLoginForm />
          <p className="mt-3 text-xs text-muted-foreground">
            Solo per chi ha registrato l&apos;azienda. Tutti possono entrare con i codici.
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
