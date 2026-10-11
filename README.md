# Piqnex

> Don't replace the whole product. Replace the missing piece.

A marketplace where people can buy, sell, or ask for individual missing,
spare, or leftover components of products - a lost earbud, a laptop
charger, a controller battery cover, a furniture wheel, and so on.

This is an MVP built to validate the idea, not a finished product. The git
history shows what has been built so far, and `VALIDATION.md` explains how to
test whether people actually want this.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** a separate NestJS API in `../piqnex-backend` (PostgreSQL via Prisma, JWT login). The frontend's Server Actions call it.
- **Hosting:** Vercel (frontend) plus any Node host for the API

## Versioning & commit messages

Every commit to this repo automatically gets a new version number (see the
`version` field in `package.json`, and the small "v..." badge in the site's
footer). This happens on its own via a git hook (`.husky/pre-commit` ->
`scripts/bump-version.js`) - you don't need to do anything, and you
shouldn't try to skip it. This means no code is ever committed (or pushed)
without the version changing.

Commit messages should be written in simple, plain English describing what
actually changed - no technical jargon - so that anyone, technical or not,
can read the project's history and understand it. This applies even to
small changes: instead of "fix bug", write something like "Fixed an issue
where the login button didn't work on mobile phones."

## 1. Run it locally

You need the backend running first (see `../piqnex-backend/README.md`: start Postgres,
run `npx prisma migrate deploy`, then `npm run start:dev`; it listens on port 4000).

```bash
cp .env.example .env.local   # then adjust if your backend is not on port 4000
npm install
npm run dev
```

Open http://localhost:3000. Only real listings from real users are shown -
sign up at `/signup`, then use `/sell` to publish one.

## 2. Environment variables

See `.env.example`. The important ones: `API_URL` / `NEXT_PUBLIC_API_URL` (the
backend address), `NEXT_PUBLIC_SITE_URL` (the public website address, used for
SEO and the sitemap) and `BACKEND_URL` (the backend address, used for the
"Continue with Google" button).

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
    categories.ts       The category list used by the home grid and dropdowns
    actions/           Server Actions (the "backend") - auth, listings, need
                       requests, contact requests, profile updates
    api-client.ts      Talks to the NestJS backend
  middleware.ts        Redirects signed-out users away from pages that need a login
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

Deploy the frontend to Vercel and the backend and Postgres to a Node host. Set the
environment variables above on the host (never commit `.env.local`).

## 7. Security notes

- Authorization is enforced by the backend (JWT login, owner checks on every edit/delete),
  not by the browser.
- All form input is validated on the server with Zod (`src/lib/validations.ts`),
  not just in the browser.
- `.env.local` (your real secrets) is git-ignored. Never commit it. Only
  `.env.example` (placeholder values) is committed.
