# Architettura di riferimento – Next.js + Prisma + Neon + shadcn/ui

Schema architetturale di una app web mobile-first, installabile come PWA, multi-tenant, con autenticazione propria.

## 1. Stack

| Area | Scelta | Note |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, RSC, Server Actions) | `proxy.ts` sostituisce `middleware.ts`; `PageProps<"/route">` / `LayoutProps` generati da `next typegen` |
| Linguaggio | TypeScript strict | alias `@/*` sulla root |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Radix), lucide-react | Tailwind configurato via CSS (`@theme` in `app/globals.css`), niente `tailwind.config.ts` |
| Tema | next-themes (`attribute="class"`) | chiaro di default, switch nell'header |
| Feedback | sonner (toast), vaul (drawer mobile) | |
| Validazione | Zod 4 | condivisa tra form e Server Actions |
| DB | Neon serverless PostgreSQL | pooled per l'app, diretta per le migrazioni |
| ORM | Prisma 7 + `@prisma/adapter-neon` | `prisma.config.ts`, client generato in `generated/prisma` |
| Test | Vitest | solo logica pura (`*.test.ts`) |
| Package manager | pnpm | |
| Deploy | Vercel + Speed Insights (`@vercel/speed-insights`) | migrazioni con `pnpm db:deploy`, non in build |
| Telemetria | TelemetryDeck (`@telemetrydeck/sdk`, `components/common/telemetry.tsx`) | segnale `pageview` a ogni cambio pagina, utente anonimo per dispositivo; attiva solo con `TELEMETRY_DECK_APP_ID`, test mode fuori produzione |

## 2. Struttura delle cartelle

```text
app/
  (auth)/            # pagine pubbliche di accesso/registrazione, con layout proprio
  (app)/             # area autenticata: layout con header + bottom nav (sidebar su desktop per gli admin), un guard nel layout
  (<ruolo>)/         # eventuale area per un ruolo con UI diversa (layout proprio)
  admin/             # area super admin separata
  manifest.ts        # manifest PWA
  icon.tsx, apple-icon.tsx, pwa-icon/[variant]/route.tsx   # icone generate con ImageResponse
  providers.tsx      # ThemeProvider + Toaster (client)
  layout.tsx         # root: font, metadata, viewport (viewportFit: cover)
  globals.css        # token shadcn light/dark + override @theme
actions/             # Server Actions, un file per dominio ("use server")
components/
  ui/                # componenti shadcn generati (da non modificare a mano)
  common/            # blocchi riusabili: SubmitButton, ConfirmAction, FormError…
  nav/               # header, navigazione (bottom nav / sidebar), switch del tema
  <feature>/         # componenti di dominio, una cartella per feature
hooks/               # hook client (useFormAction)
lib/
  prisma.ts          # client singleton con adapter Neon
  queries.ts         # letture condivise ("server-only"), include tipizzati
  action-state.ts    # tipo di ritorno comune delle azioni
  auth/              # session.ts, guards.ts, codes.ts, rate-limit.ts
  domain/            # logica pura e testata
  validation/        # schemi Zod
config/              # dati statici di configurazione
prisma/              # schema.prisma + migrations/
generated/prisma/    # client Prisma generato (ignorato da git)
proxy.ts             # controllo ottimistico del cookie + rinnovo della scadenza
docs/                # requisiti e architettura
```

Regola: `app/` contiene solo routing e composizione; la logica sta in `lib/`, le mutazioni in `actions/`.

## 3. Data layer (Neon + Prisma 7)

- **Due connessioni**: `DATABASE_URL` (host `-pooler`) usata dal client runtime tramite `PrismaNeon`; `DIRECT_URL` usata solo da Prisma Migrate in `prisma.config.ts`. Nel `datasource` di `schema.prisma` resta solo il `provider`.
- **Generator**: `provider = "prisma-client"`, `output = "../generated/prisma"`; import da `@/generated/prisma/client`.
- **Singleton** su `globalThis` in sviluppo, per non esaurire le connessioni durante l'hot reload (`lib/prisma.ts`).
- **Script**: `postinstall` e `build` eseguono `prisma generate`; `db:migrate` = `prisma migrate dev --name <nome>` (poi `prisma generate` se i tipi non si aggiornano); `db:deploy` = `prisma migrate deploy`, eseguito nel comando di build del deploy.
- **Multi-tenancy**: ogni entità appartiene a un tenant (`tenantId`). **Ogni query filtra per il tenant dell'utente in sessione**, anche con `updateMany`/`deleteMany` al posto di `update`/`delete` per id, così un id estraneo non trova righe.
- **Letture condivise** in `lib/queries.ts` con `include` costanti; i tipi derivati si ottengono con `Awaited<ReturnType<…>>`.
- **Date senza orario** salvate come `@db.Date` e maneggiate nel codice come stringhe ISO `YYYY-MM-DD`; gli orari come stringhe `HH:MM`. "Oggi" si calcola in un fuso orario esplicito, mai in quello del server.

## 4. Autenticazione e autorizzazione

- **Sessioni su DB**: token casuale (32 byte) nel cookie `httpOnly`/`sameSite=lax`/`secure`; nel DB si salva solo lo SHA-256 del token. Scadenza lunga con rinnovo scorrevole (`lib/auth/session.ts`), `getSession` memoizzata con `cache()` di React.
- **Segreti** (password, codici di accesso) solo come hash bcrypt; i codici generati si mostrano una sola volta e si possono rigenerare.
- **Rate limit** dei login su tabella DB (`LoginAttempt`: 5 tentativi → blocco di 15 minuti), con chiave per identificativo.
- **`proxy.ts`**: controllo *ottimistico* (solo presenza del cookie) e rinnovo della scadenza del cookie. **Non** è il punto di autorizzazione.
- **Guard server** (`lib/auth/guards.ts`): una funzione per livello (`requireUser`, `requireAdmin`, `requireSuperAdmin`, …). Si chiamano in ogni pagina, layout e Server Action; fanno `redirect` verso l'area corretta. Un ruolo con UI ristretta si isola facendo reindirizzare `requireUser` fuori dall'area standard.
- **Ruoli** come enum Prisma; i vincoli (es. numero massimo di admin) si verificano nell'azione, non solo nella UI.
- **Super admin** definito da variabili d'ambiente, in sola lettura, con area e login separati.

## 5. Mutazioni: pipeline delle Server Actions

Ogni azione segue sempre lo stesso ordine:

1. **Guard** → utente e tenant dalla sessione (mai dal client).
2. **Zod** `safeParse(Object.fromEntries(formData))` → al primo errore `firstError(...)`.
3. **Controlli di appartenenza**: gli id di altre entità ricevuti dal client devono appartenere al tenant.
4. **Prisma** filtrato per tenant.
5. `revalidatePath(...)` sulle pagine interessate.
6. Ritorno di un `ActionState` (`{ ok?, error?, …dati una tantum }`); `redirect` solo dove serve navigare (login/logout).

Gli argomenti extra si legano con `.bind` (`saveItem.bind(null, id)`); i messaggi di errore sono pensati per l'utente, nella sua lingua.

## 6. Pattern dei form (client)

- `useFormAction(action)` (`hooks/use-form-action.ts`): wrapper di `useActionState` che fa submit via `onSubmit` + `startTransition`, così **il form non si svuota** in caso di errore.
- `SubmitButton` con stato `pending`, `FormError` per `state.error`.
- Azioni senza form (conferma, elimina, copia) con `useTransition` + toast sonner.
- Azioni distruttive sempre dietro `ConfirmAction` (AlertDialog).
- Su mobile i form vivono in un **Drawer** (vaul) aperto dal basso; alla riuscita si chiude o mostra un risultato.

## 7. UI e design system

- **Solo token shadcn** nelle classi (`bg-card`, `text-muted-foreground`, `border`, `bg-primary/5`…), niente colori hardcoded: ogni stile deve funzionare nel tema chiaro e in quello scuro.
- **Colori come dati** (colori scelti dall'utente per un'entità): vanno in `style`, mai nelle classi; per sfondi tenui si usa `color-mix(in srgb, <colore> N%, transparent | var(--card))`, così il tint si adatta al tema.
- **Scala tipografica** personalizzata in `@theme` (`--text-xs…--text-lg` con line-height) quando i default risultano piccoli su mobile; `body` usa `text-base`.
- **Mobile-first**: contenuto `max-w-2xl`, header sticky, bottom nav fissa, safe area iOS (`env(safe-area-inset-*)`), `100dvh`. Target touch ≥ 44px (`min-h-11`).
- **Desktop solo per gli admin**: il layout dell'app ha `data-sidebar` solo per gli `ADMIN`; la variante `desktop:` (`@custom-variant` in `app/globals.css`, da `md`) trasforma la bottom nav in una sidebar a sinistra e sposta gli elementi fissati sopra la nav. I dipendenti vedono sempre la versione mobile.
- **Gerarchia nelle card**: un titolo forte, metadati in `text-muted-foreground`, dati chiave (orari, importi) in `font-semibold tabular-nums`, separatori `border-t` per le sezioni secondarie.
- **Accessibilità**: `aria-label` sui pulsanti che contengono solo un'icona, `aria-current` sulla navigazione, `section` + `aria-labelledby`, `dl/dt/dd` per le coppie etichetta/valore, icone decorative con `aria-hidden`.
- **Viste per dispositivo**: un ruolo può avere un route group dedicato con un layout diverso (es. schermo sempre acceso: niente nav, `router.refresh()` periodico e al `visibilitychange`). I filtri e la navigazione stanno nei `searchParams`, così il refresh li conserva.
- UI in un'unica lingua; date e numeri formattati con `Intl` nella locale dell'app.

## 8. PWA

- `app/manifest.ts` (`display: standalone`, `start_url` sull'area autenticata).
- Icone generate da codice con `ImageResponse` (`lib/app-icon.tsx`): `icon.tsx`, `apple-icon.tsx`, route `pwa-icon/[variant]` per 192/512/maskable (safe zone tramite padding).
- `metadata.appleWebApp` e `viewport.viewportFit = "cover"` nel root layout.

## 9. Logica di dominio e test

- La logica non banale (calcoli su date, regole di business, algoritmi di layout, generazione di testi) sta in `lib/domain/*.ts` come **funzioni pure** senza dipendenze da Next o Prisma, con un test accanto (`*.test.ts`).
- Anche gli schemi Zod e le utility di auth pure hanno test.
- Le pagine restano sottili: leggono, chiamano le funzioni di dominio e compongono.

## 10. Qualità e comandi

```bash
pnpm dev                      # sviluppo
pnpm test                     # vitest run
pnpm lint                     # eslint (config next)
pnpm typecheck                # next typegen && tsc --noEmit
pnpm build                    # prisma generate && next build
pnpm db:migrate --name <nome> # nuova migrazione (DIRECT_URL)
pnpm db:deploy                # applica le migrazioni (build di produzione)
```

Prima di considerare chiuso un cambiamento: test, typecheck, lint e, per la UI, verifica visiva in entrambi i temi.

## 11. Variabili d'ambiente

| Variabile | Uso |
| --- | --- |
| `DATABASE_URL` | Neon pooled, runtime (adapter) |
| `DIRECT_URL` | Neon diretta, Prisma Migrate |
| `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD` | accesso del super admin |

Tutte documentate in `.env.example`.

## 12. Checklist per un nuovo progetto

1. `create-next-app` (TS, Tailwind, App Router) → `shadcn init` → next-themes + sonner in `providers.tsx`.
2. Prisma 7: `prisma.config.ts` con `DIRECT_URL`, generator `prisma-client` in `generated/`, `lib/prisma.ts` con `PrismaNeon`.
3. Sessioni DB + `proxy.ts` ottimistico + `guards.ts`.
4. `ActionState`, `useFormAction`, `SubmitButton`, `FormError`, `ConfirmAction`.
5. Cartelle `actions/`, `lib/domain/`, `lib/validation/`, `lib/queries.ts`.
6. Manifest e icone PWA generate.
7. Vitest per il dominio; script `typecheck` con `next typegen`.
8. `AGENTS.md`/`CLAUDE.md` con le convenzioni del progetto che rimandano a questo documento.
