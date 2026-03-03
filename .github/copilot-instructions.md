# GAM Shop — Copilot Instructions

## Project Overview

E-commerce platform (books, apparel, accessories) built with **React 19 + TypeScript + Vite 7 + Supabase**. Deployed on Netlify. Payments via Paystack. Images hosted on Cloudinary.

## Architecture

### Layered structure — follow the existing pattern strictly

```
src/
  types/        → TypeScript interfaces (Product, Order, CartItem, UserProfile, etc.)
  services/     → All Supabase queries & external API calls (one file per domain)
  hooks/        → Custom React hooks that consume services or context
  context/      → React Context providers (Auth, Cart, Toast) — split into Def + Provider files
  components/   → UI organized by domain (account/, admin/, cart/, checkout/, product/, ui/)
  pages/        → Route-level components, re-exported via pages/index.ts barrel
  constants/    → Route paths (ROUTES object), nav links, product constants
  utils/        → Helpers, validators, formatters
  lib/utils.ts  → shadcn/ui cn() helper (clsx + tailwind-merge)
```

### Key data flow

1. **Supabase client** (`services/supabase.ts`) — single shared client, configured with `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. **Service layer** calls Supabase directly (`.from()`, `.rpc()`, `.functions.invoke()`). Services return mapped domain types, not raw DB rows. Each service has internal `mapProduct`, `mapOrder`, etc. functions that convert snake_case DB columns to camelCase TS interfaces.
3. **Hooks** call services and manage loading/error state. Hooks use context via `useAuth()`, `useAdmin()`, etc.
4. **Components** consume hooks, never call services directly.

### Context split pattern

Context type definitions live in `*ContextDef.ts` (e.g., `AuthContextDef.ts` exports `AuthContext` + `AuthContextType`), and provider implementations live in `*Context.tsx`. Hooks (`useAuth`, `useCart`, `useToast`) wrap `useContext()` with a guard.

### Route guards (in App.tsx)

- `ProtectedRoute` — requires authenticated user
- `GuestRoute` — redirects authenticated users away (login/register)
- `AdminRoute` — requires `admin` or `super_admin` role via `useAdmin()` hook
- `SuperAdminRoute` — requires `super_admin` role via `useSuperAdmin()` hook

All routes are defined inline in `App.tsx` using `<Routes>` / `<Route>` from react-router-dom v7. Route path constants live in `constants/routes.ts` (`ROUTES` object). Use these constants — never hardcode path strings.

### Layouts

- `MainLayout` — public storefront pages (header, footer)
- `AdminLayout` — admin dashboard (sidebar nav)

## UI & Styling

- **Tailwind CSS v4** with CSS-first config in `src/index.css` (no `tailwind.config`). Theme uses CSS custom properties (`--primary`, `--background`, etc.) with oklch colors.
- **shadcn/ui (new-york style)** — UI primitives in `components/ui/`. Configured via `components.json`. Add new components with `npx shadcn@latest add <component>`.
- **Class merging**: always use `cn()` from `@/lib/utils` when combining Tailwind classes.
- **Icons**: `lucide-react` — import individual icons, not the whole library.
- **Path alias**: `@/` maps to `src/`. Always use `@/` imports.

## Services & Database

- **Supabase** provides PostgreSQL + Auth + Edge Functions + Realtime.
- DB uses **Row Level Security (RLS)** — all tables have RLS policies. Migrations in `supabase/migrations/` (timestamped SQL files).
- **Realtime subscriptions** — product stock updates use `supabase.channel().on('postgres_changes', ...)`. Always clean up channels in `useEffect` return.
- **Order creation** uses an atomic DB function `create_order_with_number` (via `.rpc()`) with built-in retry logic and idempotency checks on `paymentReference`.
- **Payment flow**: Paystack inline JS on frontend → Supabase Edge Function `verify-paystack-payment` for server-side verification.
- **Image uploads**: Cloudinary via `cloudinary.service.ts` (uses `VITE_CLOUDINARY_CLOUD_NAME`/`VITE_CLOUDINARY_UPLOAD_PRESET` env vars).
- **Admin audit logging**: `audit.service.ts` tracks admin actions — call `logAdminAction()` after admin mutations in `admin.service.ts`.

### Supabase Edge Functions

Located in `supabase/functions/` — written in **TypeScript for Deno runtime** (not Node.js). Import maps in `supabase/functions/import_map.json`.

## Roles & Auth

Three roles: `customer`, `admin`, `super_admin` — stored in `profiles.role`. Auth checks:
- `useAuth()` → session/user state
- `useAdmin()` → checks `profiles` table, returns `isAdmin` (true for both admin/super_admin), `isSuperAdmin`, `role`
- `useSuperAdmin()` → calls `checkIsSuperAdmin()` RPC

## Environment Variables

All prefixed with `VITE_` for Vite client exposure:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_PAYSTACK_PUBLIC_KEY` (used by Paystack inline JS)
- `VITE_HONEYBADGER_API_KEY` (error monitoring)

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` (runs `tsc -b` then `vite build`) |
| Lint | `npm run lint` |
| Preview prod build | `npm run preview` |

## Conventions

- **Named exports only** — no default exports except `App`. Pages re-exported via barrel files (`pages/index.ts`, `pages/Admin/index.ts`).
- **Service functions** are standalone async functions (not classes). Return empty arrays or `null` on error, log with `console.error`.
- **Types** in `types/` — one file per domain. Re-exported via `types/index.ts` barrel.
- **Product categories** are the literal union `'books' | 'apparel' | 'accessories'`.
- **Currency**: KES (Kenyan Shillings). Cart defaults: 16% VAT, KES 300 shipping, free shipping over KES 10,000. These settings are loaded from DB via `supabase.rpc('get_store_settings')`.
- **snake_case ↔ camelCase**: DB columns are snake_case; TS interfaces are camelCase. Mapping happens in service-layer `map*` functions.
