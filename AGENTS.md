<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Skeddy Planner – convenzioni

PWA mobile-only per i turni del personale, multi-azienda. Requisiti in `docs/idea.md`, architettura in `docs/architecture.md` (da seguire: questo file ne riassume solo le regole di progetto).

- UI solo in italiano; date/numeri con `Intl` (`it-IT`); "oggi" e settimane in `Europe/Rome` (`config/app.ts`).
- `app/` solo routing e composizione; logica pura in `lib/domain/*` con test accanto; mutazioni in `actions/*`; letture in `lib/queries.ts`.
- Server Actions: guard (`lib/auth/guards.ts`) → Zod (`lib/validation/*`) → controllo appartenenza al tenant → Prisma filtrato per `companyId` (`updateMany`/`deleteMany`) → `revalidatePath` → `ActionState`.
- Ruoli: `ADMIN` (max 3, `MAX_ADMINS`), `EMPLOYEE`; il fondatore (`isOwner`) non si retrocede né si elimina. Super admin solo da env, sola lettura, area `/admin`.
- Codice azienda: 4 parole BIP39 italiane (`config/bip39-it.ts`). Codice personale: 8 caratteri senza ambigui, salvato come HMAC-SHA256 con `AUTH_SECRET` (`lib/auth/codes.ts`), mostrato una sola volta.
- Turni: `date` `@db.Date` gestita come `YYYY-MM-DD`, orari `HH:MM` nello stesso giorno, nessuna sovrapposizione per utente (controllo in transazione).
- Stile: solo token shadcn (brand Notion in `app/globals.css`), colori dei dipendenti come dati via `style` + `color-mix`; target touch ≥ 44px (`h-11`); non modificare a mano `components/ui/`.
- Prima di chiudere un cambiamento: `pnpm test`, `pnpm typecheck`, `pnpm lint`, verifica visiva in tema chiaro e scuro.
