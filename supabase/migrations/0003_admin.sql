-- ============================================================================
-- Piqnex - Admin foundation
-- ============================================================================
-- How to run this: Supabase Dashboard -> SQL Editor -> paste this whole file
-- -> Run. Or, if you use the Supabase CLI: `supabase db push`.
--
-- Adds the `is_admin` flag anticipated in 0001_init_schema.sql. There is no
-- self-service way to become an admin - after running this migration,
-- promote your own account by hand:
--
--   update public.profiles set is_admin = true where id = '<your user id>';
--
-- (Find your user id in Supabase Dashboard -> Authentication -> Users.)
--
-- No RLS policy changes are needed. All admin writes (listing status,
-- need-request status, category/brand create/delete) go through the
-- service-role key from server-only code, the same way the existing
-- "Catalog tables" RLS comment in 0001_init_schema.sql already anticipated
-- for a "future admin panel." `profiles` already has a public read policy,
-- so `is_admin` is readable but never written except via the service role.
-- ============================================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;
