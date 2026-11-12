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

## Routes

| Route | Area |
| --- | --- |
| `/` | Public landing page |
| `/login`, `/register` | Authentication (`/register?role=organization` preselects a role) |
| `/student/dashboard`, `/opportunities`, `/resolver`, `/matches`, `/applications`, `/impact` | Student workspace |
| `/organization/dashboard`, `/programs`, `/applications`, `/impact` | Organization workspace |
| `/admin/dashboard` | Admin workspace |

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
│   ├── shared/               StatCard, EmptyState, StatusBadge
│   ├── charts/               BarChartCard, LineChartCard (Recharts) + empty-state frame
│   ├── auth/                 LoginForm, RegisterForm, RoleSelector, FormMessage
│   └── marketing/            Landing page sections
├── config/                   Static configuration: navigation, site, status labels, barrier categories, chart colors
├── hooks/                    Reusable React hooks (e.g. useActiveNav)
├── lib/                      Utilities: cn, formatters, env, aggregation, Supabase clients
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
3. Barrier intake form in the resolver, then opportunity and program list UIs.
4. Application submission and review workflow.
5. Admin verification queue for organizations.
6. Automated tests.

## Contributing

Use feature branches and pull requests against `main`. Keep changes modular: prefer a new component or service over growing an existing file, and keep existing behavior intact when adding features.
