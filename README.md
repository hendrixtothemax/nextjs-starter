# Next.js + Supabase Starter

A minimal, production-ready starter that integrates Next.js (TypeScript) with Supabase for authentication, storage, and database migrations. The starter demonstrates a typical app flow (signup/login, protected dashboard, profile with avatar upload) and includes a `setup.js` helper to bootstrap local development.

**Purpose:** provide a well-documented template you can clone to start new projects quickly while following Next.js/Supabase best practices.

**Pages included:**
- `/` (Home) — welcome, auth status, links to login/signup or dashboard.
- `/login` — email/password login with error handling and redirect to `/dashboard` on success.
- `/signup` — email/password signup with error handling and redirect to `/dashboard` on success.
- `/dashboard` — protected; shows user info and sign out.
- `/profile` — protected; shows and edits profile fields, avatar upload to Supabase Storage, and saves updates.

**Quick Links:** [setup.js](setup.js) | [supabase/schemas](supabase/schemas) | [supabase/migrations](supabase/migrations)

**Prerequisites**

- Node.js >= 22
- npm (bundled with Node.js)
- Docker Desktop (running) — required for local Supabase containers
- Supabase CLI (optional but recommended): `npm install -g supabase` or use `npx supabase`

## Quick start

From the project root run:

```bash
node setup.js
```

What `setup.js` does:
- Installs npm dependencies (`npm install`) if needed
- Starts/ensures a local Supabase instance (using `npx supabase start`)
- Ensures `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Runs database migrations (idempotent)

The script is designed to be idempotent and safe to run multiple times. See [setup.js](setup.js) for details.

## Manual setup

If you prefer to set things up manually, follow these steps:

1. Install dependencies

```bash
npm install
```

2. Initialize Supabase (only once)

```bash
npx supabase init
```

3. Start local Supabase

```bash
npx supabase start
```

4. Create `.env.local` in the project root (or update it). Example values for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # server-only
```

5. Run database migrations

```bash
npx supabase db reset   # or: npx supabase migration up
```

6. Start the Next.js dev server

```bash
npm run dev
```

## Project structure

- **app/** — Next.js app routes and pages (Home, dashboard, auth pages)
- **components/** — reusable UI components (Navbar, AccountForm, etc.)
- **lib/** — Supabase client utilities and helpers (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- **supabase/** — declarative schemas and migrations used with Supabase CLI
- **public/** — static assets
- **styles/** — global and component styles
- **setup.js** — project setup helper script

## Using this starter for new projects

1. Clone the repo
2. Remove git history: `rm -rf .git`
3. Initialize a fresh repo: `git init` and add your remote
4. Update environment variables and Supabase project settings
5. Optionally change routes/components to fit your product

This starter is intentionally minimal so you can adapt features and auth flows quickly.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase URL (client-side)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/publishable key (client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only — never commit)
- `DATABASE_URL`: (Optional) Postgres connection string for direct DB access

Store secrets in `.env.local` for local development and in repository secrets for CI.

## Database schema overview

This starter uses declarative SQL in `supabase/schemas/profiles.sql` to define the `profiles` table. Key points:

- `profiles` fields: `id` (UUID, PK, references `auth.users`), `email`, `full_name` (or `first_name`/`last_name` as desired), `avatar_url`, `created_at`, `updated_at`.
- `updated_at` is maintained by a trigger that sets the column on UPDATE.
- A trigger function automatically inserts a `profiles` row AFTER a new user is created in `auth.users`.
- RLS (Row Level Security) is enabled on `profiles` and policies only allow users to SELECT/UPDATE/INSERT their own profile using `auth.uid()`.

See `supabase/schemas/profiles.sql` and generated migrations in `supabase/migrations` for exact SQL.

## Authentication flow

1. User signs up at `/signup`. Supabase Auth creates an `auth.users` row.
2. A Postgres trigger (server-side) inserts a corresponding `profiles` record using the user's `id` and `email`.
3. Client receives JWT tokens from Supabase and stores session client-side (cookie or local storage handled by Supabase client).
4. Protected routes (e.g., `/dashboard`, `/profile`) check session and redirect to `/login` if unauthenticated.
5. Profile updates are written to `profiles` and protected by RLS policies so users only affect their own data.

## Avatar upload

Avatar upload uses Supabase Storage. Flow:

1. User selects an image on `/profile`.
2. Client uploads to a storage bucket (e.g., `avatars`) using the Supabase client.
3. On success, the returned public URL or storage path is saved into `profiles.avatar_url`.
4. UI displays image from `avatar_url`.

## Row Level Security (RLS) policies

RLS must be activated on the `profiles` table. Typical policies:

- `SELECT`: allow where `auth.uid() = id`
- `UPDATE`: allow where `auth.uid() = id`
- `INSERT`: allow for `auth.uid() = id` (defensive)

These policies prevent users from reading or modifying other users' profiles.

## Setup script details

See [setup.js](setup.js). Expectations:

- Supabase project directory (`supabase/`) and migrations already exist in the repo
- Script is idempotent and detects running Supabase instance
- Script will create or update `.env.local` with local Supabase URL and anon key when available

## Deployment

For a simple production deploy (e.g., Vercel):

```bash
git add .
git commit -m "chore: deploy"
git push origin main
```

We recommend a CI workflow that runs migrations before the frontend build.

## GitHub Actions & migration workflow


Recommended secrets to add to GitHub repository settings:

- `SUPABASE_ACCESS_TOKEN` (for Supabase CLI remote ops)
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (for Vercel deployment)

Project secrets used by the runner (add these to repository secrets so the workflow and build can access them):

- `NEXT_PUBLIC_SUPABASE_URL` — Public Supabase URL used by the frontend during builds
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/publishable key for client-side builds
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side operations; keep secret and only use in server steps)
- `DATABASE_URL` — Optional Postgres connection string if your workflow needs direct DB access

Example workflow steps (high level):

1. Checkout repository
2. Install Supabase CLI
3. Run `supabase db push` / apply migrations to remote DB
4. Deploy frontend (Vercel or other)

Important: Configure the hosting provider to not auto-build on push (or set an ignored build step) so that migrations run first and you avoid race conditions.

## Troubleshooting

- Docker not starting: ensure Docker Desktop is running and you have enough resources (memory/CPU).
- Supabase CLI errors: update CLI with `npm i -g supabase` or use `npx supabase` for local runs.
- Missing env keys: double-check `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Migrations failing: run `npx supabase db reset` locally to reapply migrations (warning: this clears local data).
- Avatar uploads failing: check storage bucket permissions and RLS policies affecting function or RPC calls.

## Where to look in this repository

- App routes and components: [app](app) and [components](components)
- Supabase client utilities: [lib/supabase](lib/supabase)
- Declarative schemas: [supabase/schemas](supabase/schemas)
- Migrations: [supabase/migrations](supabase/migrations)
- Setup helper: [setup.js](setup.js)
