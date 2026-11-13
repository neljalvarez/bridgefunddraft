# BridgeFund

BridgeFund is an educational financial accessibility platform. It helps students identify the financial barriers between them and an educational opportunity, and connects them with verified financial support.

> **Status: foundation.** This repository contains the architecture, design system, and a working application shell for every route. Data access is stubbed behind a service layer; there is no database schema yet and no route protection (see [Roadmap](#roadmap)).

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS 4 with design tokens in `src/app/globals.css` |
| UI primitives | shadcn/ui-style components on Radix UI |
| Icons | Lucide React |
| Charts | Recharts |
| Backend (ready) | Supabase via `@supabase/ssr` |
| Font | Geist Sans, self-hosted through the `geist` package (no network needed at build time) |

## Getting started

Requirements: Node.js 20.9+ and npm.

```bash
git clone https://github.com/neljalvarez/bridgefund.git
cd bridgefund
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

Open <http://localhost:3000>. The app runs without Supabase keys; sign-in and registration then show a clear "not connected" message instead of failing.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |

Run `npm run lint && npm run typecheck && npm run build` before opening a pull request.

## Environment variables

Copy `.env.example` to `.env.local`. Real keys must never be committed; `.gitignore` excludes every `.env*` file except `.env.example`.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For auth/data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For auth/data | Public anon key. Only safe in the browser when Row Level Security is enabled on every table |
| `NEXT_PUBLIC_SITE_URL` | Optional | Base URL for auth email redirects. Defaults to `http://localhost:3000` |

Anything prefixed `NEXT_PUBLIC_` is shipped to the browser. Keep server-only secrets (for example a Supabase service role key) unprefixed and out of client code.

## Connecting Supabase

The "BridgeFund isn't connected to Supabase yet" message appears until your project keys are in `.env.local`.

1. Sign in at <https://supabase.com/dashboard> and open your project (or click **New project**).
2. Open **Project Settings → API** (in newer dashboards: **Settings → API Keys**).
3. Copy the **Project URL** and the **anon / publishable** key. Do not use the `service_role` / secret key.
4. In the project folder run `cp .env.example .env.local`, then paste the values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Stop the dev server (Ctrl+C) and run `npm run dev` again. Environment files are only read at startup.
6. In Supabase, go to **Authentication → Providers** and make sure **Email** is enabled. Under **Authentication → URL Configuration**, set the Site URL to `http://localhost:3000`.

Registration and sign-in will then work. Dashboards stay empty until the database schema is added (see the roadmap).

## Routes

| Route | Area |
| --- | --- |
| `/` | Public landing page |
| `/login`, `/register` | Authentication (`/register?role=organization` preselects a role) |
| `/student/dashboard`, `/opportunities`, `/resolver`, `/matches`, `/applications`, `/saved`, `/impact`, `/settings` | Student portal (see below) |
| `/organization/dashboard`, `/programs`, `/applications`, `/impact` | Organization workspace |
| `/admin/dashboard` | Admin workspace |

## Student portal

The student portal is fully interactive. Its centerpiece is the six-step **Gap Resolver**: opportunity info, expense breakdown (add/edit/delete, auto totals, multi-currency), eligibility details, gap analysis, resolution plan, and results with next actions. Opportunities are saved to **My Opportunities** and can be reopened at any step (`/student/resolver?opportunity=<id>&step=<n>`).

**Four kinds of support are never mixed.** Each claim lands in exactly one bucket:

| Kind | Meaning | Counts as funding? |
| --- | --- | --- |
| Delivered | Support you have received | Yes |
| Approved | Confirmed by the provider, not yet delivered | Yes |
| Potential | Planned or applied for, awaiting a decision | **No** |
| Estimated | Self-directed reductions such as free alternatives | **No** |

`remaining gap = original total − personal contribution − (approved + delivered)`. Pending support is never counted. The math lives in `src/lib/gap/calculate.ts`.

**Privacy.** The portal asks only for country of residence, education level, optional field and enrollment, a need-based opt-in, and an approximate contribution. It never asks for income, bank details, ID numbers, or immigration status.

**Persistence (current).** Data is stored in this browser's `localStorage` via `src/lib/storage/student-store.ts`; nothing syncs across devices. That store is the single swap point: replace it with Supabase-backed services without touching the views.

**Demo data.** "Explore with demo data" loads two fictional opportunities and a fictional support catalog (`src/data/`). Everything is labeled as demo and removable from the dashboard or Settings. Exchange rates in `src/config/currencies.ts` are fixed approximations, not live rates.

## Project structure

```
src/
├── app/                      Routes and layouts only (thin)
│   ├── (marketing)/          Public site layout + landing page
│   ├── (auth)/               Login and register
│   ├── student/              layout.tsx renders <AppShell role="student">
│   ├── organization/         layout.tsx renders <AppShell role="organization">
│   ├── admin/                layout.tsx renders <AppShell role="admin">
│   ├── globals.css           Design tokens (colors, radius, shadows)
│   └── layout.tsx            Root layout, font, metadata
├── components/
│   ├── ui/                   Primitives: Button, Card, Badge, Input, Label, Separator, Sheet
│   ├── layout/               AppShell, Sidebar, Topbar, MobileNav, PageHeader, public header/footer, Logo
│   ├── shared/               StatCard, EmptyState, StatusBadge, Field, PortalSkeleton
│   ├── student/              Student portal views; resolver/ holds the 6-step Gap Resolver wizard
│   ├── charts/               BarChartCard, LineChartCard (Recharts) + empty-state frame
│   ├── auth/                 LoginForm, RegisterForm, RoleSelector, FormMessage
│   └── marketing/            Landing page sections
├── config/                   Static configuration: navigation, site, status labels, currencies, countries, assistance kinds, chart colors
├── data/                     Clearly labeled fictional demo data (support catalog, demo opportunities)
├── hooks/                    Reusable React hooks (e.g. useActiveNav)
├── lib/                      Utilities: cn, formatters, env, Supabase clients
│   ├── gap/                  Pure gap math, matching, validation, claims, portfolio, next actions
│   └── storage/              Student portal store (localStorage) + sanitizer
├── services/                 Data access. One file per domain, all return ServiceResult<T>
└── types/                    Shared data models and enums
```

### How the pieces fit

- **Pages stay thin.** A page sets metadata, calls services, and composes components. Markup and logic live in `components/`, `services/`, and `lib/`.
- **One shell per role.** Each role's `layout.tsx` renders `AppShell` once. Navigation comes from `ROLE_CONFIG` in `src/config/navigation.ts`.
- **Services return `ServiceResult<T>`**, a discriminated union (`ok: true | false`), so pages handle failure explicitly. Swap a stub for a Supabase query without touching any page.
- **Server vs client.** Components are Server Components by default. Only interactive pieces (`"use client"`) are forms, the sidebar active state, the mobile drawer, and Recharts views. Charts are split so Server Components can pass plain data to a small client view.
- **Cache Components is on.** Runtime data (`cookies()`, `searchParams`) must be read inside a `<Suspense>` boundary. `/register` shows the pattern.

### Adding a feature

1. Add or extend a type in `src/types/`.
2. Add a service function in `src/services/` returning `ServiceResult<T>`.
3. Create the route under the role's folder and add one entry to `ROLE_CONFIG`.
4. Build the UI from existing components; add new reusable pieces to `components/shared/` or `components/ui/`.

## Design system

Tokens are defined once in `src/app/globals.css` and exposed as Tailwind utilities.

| Token | Value | Utility examples |
| --- | --- | --- |
| Navy | `#142B49` | `bg-navy`, `text-navy` |
| Blue (primary) | `#2563EB` | `bg-primary`, `text-primary` |
| Background | `#F8FAFC` | `bg-background` |
| Surface | `#FFFFFF` | `bg-card` |
| Text | `#172033` | `text-foreground` |
| Secondary text | `#64748B` | `text-muted-foreground` |
| Success | `#16A34A` | `text-success`, `bg-success-soft` |

Cards use a subtle border and soft shadow (`shadow-card`); the radius scale derives from `--radius`. `src/config/chart-theme.ts` mirrors the brand colors for Recharts, which needs literal color values.

The UI components follow shadcn/ui conventions (class-variance-authority variants, `cn()` helper, Radix primitives) and `components.json` is configured so additional components can be added with `npx shadcn@latest add <component>`.

## Authentication and security notes

- `signInWithPassword` / `signUpWithPassword` in `src/services/auth.ts` use Supabase Auth from the browser.
- Admin accounts are never self-registered; the register form only offers student and organization.
- The role read at sign-in comes from `user_metadata`, which users can edit. It is used **only** to pick a landing page. Real authorization must use Row Level Security and a role stored in `app_metadata` or a protected table.
- Security headers are set in `next.config.ts`.
- No credentials live in source. See [Environment variables](#environment-variables).

## Roadmap

Not built yet, in a sensible order:

1. Supabase schema and Row Level Security policies matching `src/types/`, then replace the service stubs.
2. Route protection with `src/proxy.ts` (Next.js 16's replacement for middleware) plus server-side role checks.
3. Move student portal data from `localStorage` to Supabase, and replace the demo support catalog with verified provider listings.
4. Application submission and review workflow.
5. Admin verification queue for organizations.
6. Automated tests.

## Contributing

Use feature branches and pull requests against `main`. Keep changes modular: prefer a new component or service over growing an existing file, and keep existing behavior intact when adding features.
