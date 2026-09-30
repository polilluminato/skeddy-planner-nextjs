import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { APP_LOCALE } from "@/config/app";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { getCompaniesOverview } from "@/lib/queries";

export const metadata: Metadata = { title: "Aziende" };

const dateFmt = new Intl.DateTimeFormat(APP_LOCALE, { dateStyle: "medium", timeZone: "Europe/Rome" });

export default async function SuperAdminHome() {
  await requireSuperAdmin();
  const companies = await getCompaniesOverview();
  const people = companies.reduce((sum, c) => sum + c._count.users, 0);

  return (
    <>
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Aziende</h1>
        <p className="text-sm text-muted-foreground">
          {companies.length} aziende · {people} persone
        </p>
      </div>
      {companies.length === 0 ? (
        <p className="rounded-xl border bg-card p-4 text-muted-foreground">Nessuna azienda registrata.</p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {companies.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/companies/${c.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-accent">
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">{c.code}</span>
                  <span className="text-xs text-muted-foreground">
                    {c._count.users} persone · {c._count.shifts} turni · dal {dateFmt.format(c.createdAt)}
                  </span>
                </span>
                <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
