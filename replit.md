# GSS Hong

Official web portal for Government Secondary School, Hong (Adamawa State, Nigeria) — a public-facing site covering academics, alumni registration/sign-in, news, and contact/admissions information.

## Run & Operate

- `pnpm --filter @workspace/gss-hong run dev` — run the GSS Hong web portal (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000, currently unused by the portal)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Firebase web config is set as shared env vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web portal: React + Vite (`artifacts/gss-hong`), Tailwind v4 theme tokens, lucide-react icons
- Firebase SDK initialized in `artifacts/gss-hong/src/lib/firebase.ts` (app/auth/firestore) — config wired, no auth flows implemented yet
- API: Express 5 (`artifacts/api-server`) — not currently used by the portal (portal is presentation-only with client-side form state)
- DB: PostgreSQL + Drizzle ORM (provisioned, schema not yet populated)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/gss-hong/src/App.tsx` — entire site (Home/Academics/Alumni/News/Contact), paged via internal `useState`, not a router
- `artifacts/gss-hong/src/lib/firebase.ts` — Firebase app initialization
- `artifacts/gss-hong/src/index.css` — Tailwind v4 theme tokens (HSL triplets, light + dark)

## Architecture decisions

- The site was ported from an uploaded static design (single-file `App.tsx`) rather than built via the design subagent, since a complete existing design was provided to import faithfully.
- Alumni registration/login and contact forms are UI-only (client state, `setSubmitted`/`setSent`) — no backend wiring yet. Firebase is initialized but not yet connected to these forms; wire `auth`/`db` from `src/lib/firebase.ts` into them when real accounts/persistence are needed.
- Official school name/acronym was renamed from "GSSS Hong" (Government **Science** Secondary School) to "GSS Hong" (Government Secondary School) throughout. Generic uses of the word "science" describing the curriculum (e.g. "Computer Science", "Science Curriculum", "Science Olympiad") were intentionally left unchanged — only the institution's formal name/acronym was renamed.

## Product

- Public marketing/info site for the school: hero, about, academics (4 science departments), news feed, alumni portal (register/sign-in UI), contact form + faculty directory.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Vite only exposes `VITE_`-prefixed env vars to client code — Firebase config vars must keep the `VITE_FIREBASE_*` naming.
- `src/index.css` theme tokens use raw `H S% L%` triplets (no `hsl()` wrapper) consumed via `hsl(var(--x))` — don't paste hex/oklch values directly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
