# Piqnex

> Don't replace the whole product. Replace the missing piece.

A marketplace where people can buy, sell, or ask for individual missing,
spare, or leftover components of products - a lost earbud, a laptop
charger, a controller battery cover, a furniture wheel, and so on.

This is an MVP built to validate the idea, not a finished product. See
`PROJECT_CHECKLIST.md` for what's done and what's next, and `VALIDATION.md`
for how to test whether people actually want this.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions + Route Handlers
- **Database/Auth/Storage:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **Hosting:** Vercel

## 1. Run it locally (works even without Supabase, using sample data)

```bash
npm install
npm run dev
```

Open http://localhost:3000. The homepage, browse page, and search will all
work using sample/demo data (clearly marked with a "Sample" badge) even
before you've set up Supabase. Signup, login, publishing real listings, and
saving need requests need a real Supabase project - see step 2.

## 2. Connect Supabase (needed for accounts, real listings, and photos)

1. Go to https://supabase.com, create a free account, and create a new
   project.
2. In your project, open **SQL Editor** and run, in this order:
   - `supabase/migrations/0001_init_schema.sql` (tables, indexes, security rules)
   - `supabase/migrations/0002_storage.sql` (photo storage bucket + rules)
   - `supabase/seed.sql` (starter categories/brands/products/parts)
3. Open **Settings -> API** and copy your **Project URL** and **anon public
   key**.
4. Copy `.env.example` to `.env.local` and fill in those two values:

   ```bash
   cp .env.example .env.local
   ```

5. Restart the dev server (`npm run dev`). Sign up for an account at
   `/signup`, then try `/sell` to publish a real listing and `/need` to save
   a real need request.

**Why this two-step design?** So you (or anyone reviewing this project)
can see the whole UI and click around immediately, without first creating
a cloud account. That matters for a beginner exploring the code, and it
matters for validating the idea quickly (see `VALIDATION.md`).

## 3. Useful commands

```bash
npm run dev          # start the local dev server
npm run build         # production build (also type-checks and lints)
npm run start         # run the production build locally
npm run lint          # ESLint
npm run type-check    # TypeScript only, no build
```

## 4. Project structure

```
src/
  app/                 Pages (Next.js App Router) - one folder per route
    page.tsx           Homepage
    need/              "I Need a Part" - search + save a need request
    sell/              "I Have a Part" - listing form
    browse/            Marketplace search/filter/browse
    parts/[id]/        Listing detail page
    login/ signup/ profile/   Auth + account management
  components/
    ui/                Design system primitives (Button, Input, Card, ...)
    layout/            Navbar, Footer
    home/              Homepage sections (Hero, CategoryGrid, ...)
    listings/          Listing card/grid/form/filters (shared by several pages)
    need/              "I Need" specific components
    auth/ profile/     Auth forms, account management widgets
  lib/
    types.ts           Core TypeScript types, mirroring the database schema
    validations.ts     Zod schemas - used for both client and server validation
    matching.ts         The MVP matching engine (see below)
    listings.ts, need-requests.ts, profile-data.ts   Data-access functions
    sample-data.ts      Dev/demo data (never written to the real database)
    actions/           Server Actions (the "backend") - auth, listings, need
                       requests, contact requests, profile updates
    supabase/          Supabase client setup (browser, server, middleware)
  middleware.ts        Redirects signed-out users away from /sell and /profile
supabase/
  migrations/          SQL migration files - run these in the Supabase SQL Editor
  seed.sql             Starter catalog data (categories/brands/products/parts)
```

## 5. How matching works (MVP)

`src/lib/matching.ts` implements one rule: a listing is an "exact match" for
a need request when the brand, product, and part are the same (and the
model too, if both sides specify one). That's it - no fuzzy matching, no AI
guesses. This is deliberate: a marketplace this small only earns trust by
being honest about what's a confirmed match. The architecture (see the
`part_compatibility` table in the schema) leaves room for a smarter
compatibility engine later without a breaking schema change.

## 6. Deploying

See `PROJECT_CHECKLIST.md` -> "Deployment" for the step-by-step Vercel +
Supabase production setup.

## 7. Security notes

- Every table has Row Level Security enabled - see the policies at the
  bottom of `supabase/migrations/0001_init_schema.sql`. Users can only
  edit/delete their own listings and need requests, even if someone
  tampers with client-side requests.
- All form input is validated on the server with Zod (`src/lib/validations.ts`),
  not just in the browser.
- `.env.local` (your real secrets) is git-ignored. Never commit it. Only
  `.env.example` (placeholder values) is committed.
