# Skeddy Planner

PWA mobile per gestire i turni del personale di più aziende: dipendenti, turni giornalieri, ore settimanali previste e calendario (giorno/settimana/mese).

Stack: Next.js 16, React 19, Tailwind 4 + shadcn/ui, Prisma 7 su Neon PostgreSQL, Vitest. Dettagli in [`docs/architecture.md`](docs/architecture.md).

## Avvio

```bash
cp .env.example .env      # compila DATABASE_URL, DIRECT_URL, AUTH_SECRET, SUPERADMIN_*
pnpm install
pnpm db:deploy            # applica le migrazioni al DB
pnpm dev
```

`AUTH_SECRET` si genera con `openssl rand -base64 32`. Se lo cambi, i codici personali esistenti smettono di funzionare e vanno rigenerati.

## Comandi

```bash
pnpm test        # test della logica pura
pnpm typecheck   # next typegen && tsc --noEmit
pnpm lint
pnpm build       # prisma generate && next build
pnpm db:migrate --name <nome>   # nuova migrazione (usa DIRECT_URL)
```

## Deploy su Vercel

Imposta le variabili d'ambiente di `.env.example` e usa come build command `pnpm db:deploy && pnpm build`.

## Accessi

- **Registrazione** (`/signup`): crea l'azienda e il primo amministratore; mostra codice azienda e codice personale.
- **Login** (`/login`): codice azienda + codice personale per tutti; email + password per il fondatore.
- **Super admin** (`/admin/login`): credenziali da `SUPERADMIN_EMAIL`/`SUPERADMIN_PASSWORD`, sola lettura.
