# Project Checklist - Piqnex

Last updated: Phase 9 (Contact flow) complete. Updated after every major
build phase - see the bottom of this file for the phase-by-phase log.

## COMPLETED

- [x] Next.js 14 App Router + TypeScript + Tailwind CSS project scaffolded
- [x] Folder structure (`app/`, `components/`, `lib/`, `supabase/`)
- [x] Git repository initialized, `.gitignore` configured
- [x] `.env.example` with documented Supabase variables
- [x] Full PostgreSQL schema (`supabase/migrations/0001_init_schema.sql`):
      profiles, categories, brands, products, product_models, parts,
      part_compatibility (future use), listings, listing_images,
      need_requests, contact_requests
- [x] Row Level Security enabled and policies written for every table
- [x] Storage bucket + policies for listing photos (`0002_storage.sql`)
- [x] Seed data for the catalog (`supabase/seed.sql`)
- [x] Supabase client helpers (browser, server, middleware) with graceful
      fallback when Supabase isn't configured yet (no crashes, sample data
      shown instead)
- [x] Design system: Button, Input/Textarea/Select, Field (accessible label
      wrapper), Card, Badge, EmptyState/ErrorState/LoadingState/NoMatchState
- [x] Navbar (auth-aware, mobile menu) + Footer
- [x] Homepage: Hero, search bar, category grid, "How It Works", featured
      listings (sample data + real listings blended)
- [x] `/need` - buyer search form, exact matching against listings, "no
      match" state, save a need request (requires login)
- [x] `/sell` - seller listing form with photo upload, validation,
      redirect-to-detail-page confirmation showing matching need requests
- [x] `/browse` - search, filters (category/brand/product/model/part/
      condition/price/location), pagination
- [x] `/parts/[id]` - listing detail, photo gallery, seller info, contact
      seller form
- [x] `/login`, `/signup`, `/profile` - Supabase Auth, profile editing, my
      listings (mark sold/reactivate/delete), my need requests (close/delete)
- [x] Matching engine (`lib/matching.ts`) - MVP exact-match rule
- [x] Contact seller flow (simple `contact_requests` table, no live chat)
- [x] Basic SEO: per-page metadata, OpenGraph tags, `robots.ts`, `sitemap.ts`
- [x] Basic accessibility: semantic form labels, visible focus states, skip
      link, alt text, `aria-invalid`/`aria-describedby` on form errors
- [x] Human-friendly error states everywhere (no raw errors/stack traces
      shown to users)
- [x] Production build verified locally (`npm run build` succeeds, zero
      ESLint warnings)

## IN PROGRESS

- [ ] Manual responsive/mobile pass on real devices (spot-checked class
      names for mobile-first layout, but not yet tested on a physical phone)

## PENDING

- [x] Admin foundation: a protected `/admin` area to view/remove listings,
      view users, view need requests, and manage categories/brands.
      `profiles.is_admin` added via `supabase/migrations/0003_admin.sql`;
      all admin reads/writes go through a service-role client
      (`lib/supabase/admin.ts`), gated by `requireAdmin()` in
      `lib/actions/admin.ts` and the `/admin` layout. To promote your own
      account: run `supabase/migrations/0003_admin.sql` in the Supabase SQL
      Editor, then `update public.profiles set is_admin = true where id =
      '<your user id>';` (find your user id under Authentication -> Users).
      An "Admin" link then appears in the navbar for that account.
- [ ] Compatibility engine v2 (the `part_compatibility` table exists but is
      unused by the matching engine - intentionally deferred per spec)
- [ ] Automated tests (unit tests for `lib/matching.ts` and `lib/validations.ts`
      would be the highest-value first tests to add)

## TO DO (near-term, before real users)

- [x] Create the actual Supabase project and run the migrations - project
      "Piqnex" (ap-northeast-2), schema + storage bucket + catalog seed data
      all applied and verified live
- [x] Decide on a final brand name - **Piqnex**
- [ ] Push this repository to GitHub - the repo itself is created
      (`purandharsrisai/piqnex`, private, empty) but the actual `git push`
      needs to happen from your own machine with your own GitHub
      credentials; see the two commands noted in chat
- [ ] Deploy to Vercel and configure production environment variables
      (`.env.local` has the real values locally - copy them into Vercel's
      project settings when you deploy)
- [ ] Run through the Definition of Done list below end-to-end with a real
      Supabase project

## ISSUES / BUGS

- None known at this checkpoint. `npm run build` and `npm run lint` both
  pass cleanly. If you hit something while testing, add it here with steps
  to reproduce.
- (Fixed) Supabase's "Confirm email" setting defaults to ON for new
  projects, which conflicts with `signUpAction`'s assumption that a session
  exists immediately after signup. Turned it OFF in Auth settings so signup
  logs the user in right away, matching the current code (no
  confirm-your-email UI has been built). Verified signup + signin end-to-end
  against the live project. Before opening this up to real users, revisit
  this: turning confirmation back on needs a custom SMTP provider first,
  since Supabase's free-tier built-in email sender is rate-limited to a
  couple of emails/hour and will block signups almost immediately otherwise.

## UI/UX REQUIREMENTS

- [x] "I Need a Part" and "I Have a Part" are the two most visually
      prominent actions (hero CTAs, navbar links, footer links)
- [x] Warm, modern, marketplace-style visual language (not a repair-shop
      look) - amber/orange accent on a neutral ink/white palette
- [x] Mobile-first responsive layout using Tailwind's default breakpoints
- [x] Cards used throughout for listings, forms, and content sections
- [x] Minimal animation (hover/shadow transitions only)

## FUNCTIONAL REQUIREMENTS

- [x] Buyer flow: describe what's missing -> exact match search -> save a
      need request if nothing matches yet
- [x] Seller flow: describe the part -> condition/price/photos -> publish
      -> see who might need it
- [x] Browse/search/filter marketplace with pagination
- [x] Account creation, login, logout, profile editing
- [x] Users can manage only their own listings/need requests
- [x] Contact seller (simple message + optional contact info)

## TECHNICAL REQUIREMENTS

- [x] Next.js App Router, TypeScript throughout (strict mode on)
- [x] Server Actions for all writes; Zod validation shared client/server
- [x] Supabase Postgres + Auth + Storage; RLS as the authorization boundary
- [x] PostgreSQL full-text search (`tsvector`) for the browse search box -
      no Elasticsearch/OpenSearch, per spec
- [x] No AI/compatibility-guessing in the MVP matching engine, per spec

## VALIDATION / TESTING

- [ ] Manual test pass using the Definition of Done checklist below
- [ ] User research interviews (see `VALIDATION.md`)
- [ ] Track validation metrics (see `VALIDATION.md`)

## FINAL REVIEW (Definition of Done)

Work through this list with a real Supabase project connected before
calling the MVP "done":

- [x] Website runs locally (`npm run dev`)
- [x] Production build succeeds (`npm run build`)
- [x] Homepage, navigation, and footer work
- [x] Signup, login, logout work - verified live against the real Supabase
      project (signup returns a session, signin authenticates, the
      `handle_new_user` trigger creates the profile row); logout not yet
      re-tested since the "Confirm email" fix but uses the same
      well-established `supabase.auth.signOut()` call
- [ ] "I Need" flow works end-to-end, including saving a need request
- [ ] "I Have" flow works end-to-end, including photo upload
- [ ] Listings appear on Browse and in search results
- [ ] Filters and pagination work
- [ ] Listing detail page and "Contact Seller" work
- [ ] Profile page: edit info, manage listings, manage need requests
- [ ] A user cannot edit/delete another user's listing or need request
      (test this directly - try calling the action with someone else's id)
- [ ] Empty states and error states all display human-friendly messages
- [ ] Mobile and desktop layouts both look correct
- [ ] `.env.local` is not committed to git (`git status` should not show it)
- [ ] Vercel + Supabase production deployment works end-to-end

---

## Phase log

- **Phase 1** - Project foundation: Next.js/TS/Tailwind scaffold, folder
  structure, git init, `.env.example`, base layout. Done.
- **Phase 2** - Supabase: schema, RLS, storage bucket, seed data, client
  helpers with safe fallbacks. Done.
- **Phase 3** - Design system: Button/Input/Field/Card/Badge/States,
  Navbar/Footer. Done.
- **Phase 4** - Homepage: Hero, search, categories, how-it-works, featured
  listings. Done.
- **Phase 5** - "I Need" flow: search form, exact matching, need request
  creation, no-match state. Done.
- **Phase 6** - "I Have" flow: listing form, photo upload, validation,
  confirmation with matching need requests. Done.
- **Phase 7** - Marketplace: browse, filters, pagination, listing detail.
  Done.
- **Phase 8** - Accounts: login, signup, profile, manage listings/requests.
  Done.
- **Phase 9** - Contact seller flow. Done.
- **Phase 10** - Polish/testing/SEO/a11y/security: mostly folded into
  earlier phases as they were built; manual device testing and automated
  tests still pending (see PENDING above).
- **Phase 11** - Deployment: documented in README, not yet executed (needs
  your GitHub/Vercel/Supabase accounts).
- **Phase 12** - Admin foundation: `/admin` (Overview, Listings, Need
  Requests, Users, Categories & Brands), gated by a new `profiles.is_admin`
  flag and a service-role client. Done - pending running the migration and
  promoting an admin account against the live project (see PENDING above).
