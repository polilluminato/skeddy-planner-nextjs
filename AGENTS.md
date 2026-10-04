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
- Ruoli: `ADMIN` (max 3, `MAX_ADMINS`), `EMPLOYEE`; il direttore (`isOwner`, in UI "Direttore") non si retrocede né si elimina, se non dall'Amministrazione. Super admin solo da env, sola lettura, area `/admin`.
- Amministrazione (`Organization`, in UI "Amministrazione"): un account per più negozi, esterno ai team, sceglie il team attivo in `/org` (salvato sulla `Session`). Da `requireUser()` arriva con `isSupervisor`, `isAdmin`, `user`/`meId` null: usare `meId` per "me". I team delle organizzazioni non hanno direttore. Collegare un'azienda esistente a un'organizzazione si fa solo a mano (SQL su `Company.organizationId`).
- Codice azienda: 4 parole BIP39 italiane (`config/bip39-it.ts`). Codice personale: 8 caratteri senza ambigui, salvato come HMAC-SHA256 con `AUTH_SECRET` (`lib/auth/codes.ts`), mostrato una sola volta.
- Turni: `date` `@db.Date` gestita come `YYYY-MM-DD`, orari `HH:MM` nello stesso giorno, nessuna sovrapposizione per utente (controllo in transazione). Gli orari si inseriscono sempre in 24h con `TimeField` (`components/common/time-field.tsx`), mai con `<input type="time">` (segue la lingua del browser e può mostrare AM/PM). Le date si mostrano come `DD/MM/YYYY` con `DateField` (`components/common/date-field.tsx`), non con `<input type="date">` a vista.
- Messaggi (`/messages`): un canale per azienda (`Message`), scrivono ed eliminano solo gli `ADMIN`, i dipendenti leggono; i non letti sono i messaggi dopo `User.messagesReadAt`. Niente push: `AutoRefresh` (`router.refresh()` al ritorno sulla pagina e ogni 60s nella chat).
- Stile: solo token shadcn (brand monocromo stile Cal.com da `docs/design.md`, token in `app/globals.css`), colori dei dipendenti come dati via `style` + `color-mix`; target touch ≥ 44px (`h-11`); non modificare a mano `components/ui/`.
- Desktop: solo gli `ADMIN` hanno la sidebar a sinistra al posto della bottom nav (`data-sidebar` sul layout + variante `desktop:`); i dipendenti restano sempre in vista mobile. Nel calendario desktop: card con le ore della settimana per persona e griglia oraria stile Google Calendar per giorno/settimana (`components/calendar/time-grid.tsx`, layout dei turni sovrapposti in `lib/domain/time-grid.ts`).
- Prima di chiudere un cambiamento: `pnpm test`, `pnpm typecheck`, `pnpm lint`, verifica visiva in tema chiaro e scuro.
