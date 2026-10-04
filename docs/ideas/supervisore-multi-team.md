# Supervisore multi-team (Organizzazioni)

## Context
Oggi ogni account appartiene a una sola azienda (`User.companyId`). Una catena di negozi con un ufficio amministrativo centrale non può gestire più negozi da un solo account. Serve un ruolo sopra l'admin che vede più team e sceglie, dalla navigazione, su quale operare. Utenti e admin dei team restano legati a un solo team.

## Problem Statement
Come possiamo permettere a un ufficio centrale di creare e gestire più negozi da un solo account, senza toccare il modello "un dipendente = un team" né il login con codici dei dipendenti?

## Decisioni prese (dal confronto)
- **Nome in UI: "Amministrazione"**. Nel codice: `Organization`, `isSupervisor`.
- **Il supervisore crea i team.** Signup dedicato ("Un negozio" / "Più negozi"), login con email e password dalla stessa pagina.
- **Un solo supervisore per organizzazione**: l'organizzazione *è* l'account (niente modello `Supervisor` separato).
- **Poteri**: come un ADMIN sul team scelto, in più nomina, retrocede ed elimina gli admin. Il limite `MAX_ADMINS = 3` resta valido per gli utenti del team.
- **Esterno al team**: non compare nella lista Team, non ha turni, non occupa un posto admin.
- **Nei team dell'organizzazione non c'è un "fondatore"** (`isOwner` sempre false).
- **"Fondatore" → "Direttore"**: si rinomina solo l'etichetta nelle aziende singole, il comportamento resta uguale.
- **Aziende esistenti**: si agganciano a un'organizzazione solo a mano (SQL), senza UI.
- **Extra**: switch del team più una pagina di riepilogo multi-team.

## Recommended Direction
Nuova entità `Organization` (nome, email, passwordHash) che possiede N `Company` tramite `Company.organizationId` (nullable: le aziende singole restano come sono). La sessione del supervisore porta `organizationId` e `activeCompanyId`. `requireUser()` risolve il team attivo verificando che appartenga all'organizzazione e restituisce lo stesso `companyId` di oggi. Così calendario, team, messaggi ed export funzionano senza modifiche ai filtri per tenant.

Il lavoro vero è sganciare le pagine da `user.id`, perché il supervisore non è un `User`. Il contesto del guard espone `meId: string | null` e `isSupervisor`, e i ~15 punti che usano `user.id` si adattano: il filtro "solo i miei" va nascosto, `isMe` vale false, i non letti sono 0, il profilo è il suo.

Lo switch è volutamente banale: un link "Negozio: Milano ▾" nella sidebar desktop e una voce "Negozi" nella bottom nav portano a `/org`, che mostra il riepilogo dei team (dipendenti, ore pianificate/contrattuali della settimana) e permette di scegliere un team o crearne uno nuovo. Niente dropdown custom.

## Key Assumptions to Validate
- [ ] Un account condiviso basta all'ufficio centrale. Da chiedere al primo cliente catena: se servono più persone, `Organization` va separata in `Supervisor[]`.
- [ ] Il team attivo sulla sessione (condiviso tra tab) non dà fastidio. Da verificare con l'uso reale; in alternativa si passa a un prefisso URL.
- [ ] I negozi accettano che il supervisore possa rimuovere i loro admin. È coerente con "sta sopra", ma va detto chiaramente in UI.

## MVP Scope
**Schema (`prisma/schema.prisma`)**
- `Organization { id, name, email @unique, passwordHash, createdAt, companies, sessions }`
- `Company.organizationId String?` (relazione, `@@index`)
- `Session.organizationId String?` e `Session.activeCompanyId String?`
- `Message.fromOrganization Boolean @default(false)`: l'autore mostrato è il nome dell'organizzazione

**Auth**
- `lib/auth/session.ts`: `createSession` accetta `{ organizationId }`; `getSession` include `organization` (con le sue companies) e `activeCompanyId`.
- `lib/auth/guards.ts`: nuovo ramo supervisore in `requireUser()`. Senza team attivo valido → `redirect("/org")`. Contesto: `{ user: null, meId: null, isSupervisor: true, isAdmin: true, company, companyId }`. Nuovo `requireSupervisor()`. Va aggiornato anche `redirectIfAuthenticated`.
- `actions/auth.ts`: signup multi-negozio (organizzazione + primo team, sessione con quel team attivo → `/team` per creare il primo admin). `loginWithEmail` cerca anche in `Organization`. L'unicità dell'email va controllata su entrambe le tabelle.
- `lib/validation/auth.ts`: schema per il signup dell'organizzazione.

**Area supervisore**
- `app/org/` (layout proprio, come `app/admin/(area)`): riepilogo dei team della settimana corrente, riusando `hoursSummary` di `lib/domain/schedule.ts`; form "Nuovo team"; cambio password.
- `actions/organization.ts`: `selectCompany(companyId)` (verifica appartenenza → aggiorna la sessione → `redirect("/calendar")`), `createCompany` (riusa `generateCompanyCode` e `retryOnUnique`).

**Adattamenti alle pagine e alle action esistenti (pattern: `user.id` → `meId`)**
- `app/(app)/layout.tsx`: niente conteggio non letti per il supervisore; nav con `isSupervisor` e nome del team attivo.
- `components/nav/app-nav.tsx`: switch del team (link a `/org`) nella sidebar; su mobile "Profilo" diventa "Negozi".
- `app/(app)/calendar/page.tsx`, `team/page.tsx`, `team/[id]/page.tsx`, `messages/page.tsx`: usano `meId`. `profile/page.tsx` redirige a `/org` se è un supervisore.
- `actions/employees.ts`: il supervisore aggira i blocchi su `isOwner` e su sé stesso; resta il limite `MAX_ADMINS`.
- `actions/messages.ts` e `lib/domain/messages.ts`: messaggio con `fromOrganization: true`, autore = nome dell'organizzazione; `markMessagesRead` non fa nulla per il supervisore.
- Rinomina dell'etichetta "Fondatore" → "Direttore": `components/team/member-badges.tsx`, `app/(app)/team/[id]/page.tsx`, messaggio di errore in `actions/employees.ts`. La colonna `isOwner` resta.

**Super admin (sola lettura)**: in `/admin` si mostra l'organizzazione di appartenenza di ogni azienda.

**Documentazione**: `docs/architecture.md` e `AGENTS.md` (ruoli, team attivo, Direttore). One-pager in `docs/ideas/supervisore-multi-team.md`.

## Not Doing (and Why)
- **Più supervisori per organizzazione**: richiede la gestione utenti a livello organizzazione. Lo si aggiunge se un cliente lo chiede.
- **UI per collegare aziende esistenti**: richiede un flusso di consenso; per i pochi casi si usa SQL a mano.
- **Team nell'URL (`/t/[id]/…`)**: vorrebbe dire spostare tutte le route; il team attivo sulla sessione basta.
- **Messaggio broadcast a tutti i team**: non richiesto; il supervisore può scrivere team per team.
- **Eliminazione o rinomina dei team dal supervisore**: nell'MVP la creazione basta, eliminare un negozio è raro e distruttivo.
- **Rinominare la colonna `isOwner`**: una migrazione senza valore, cambia solo l'etichetta.
- **Piano dedicato nella sezione pricing della landing**: è una decisione commerciale da prendere a parte.

## Open Questions
- ~~Nome del ruolo in UI~~ → deciso: **"Amministrazione"** (badge, nav, autore dei messaggi, signup "Più negozi"). Nel codice resta `Organization` / `isSupervisor`.
- Il supervisore deve vedere in `/org` anche il codice azienda di ogni team, per comunicarlo ai negozi? (Default: sì.)

## Verification
- Test unitari per le parti pure: risoluzione del contesto del guard (team valido / non dell'organizzazione / assente), autore dei messaggi in `lib/domain/messages.test.ts`, schema di validazione del signup.
- Manuale: signup multi-negozio → creare 2 team → creare un admin nel team A → passare al team B → verificare che calendario, team e messaggi mostrino solo B. Provare a forzare un `companyId` di un'altra organizzazione in `selectCompany` → rifiutato. Verificare che un admin di A non veda B. Il login con codici dei dipendenti resta invariato.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, verifica visiva di `/org`, nav e switch in tema chiaro e scuro, mobile e desktop.
