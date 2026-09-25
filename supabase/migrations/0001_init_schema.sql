-- ============================================================================
-- Piqnex - Initial Schema
-- ============================================================================
-- How to run this: Supabase Dashboard -> SQL Editor -> paste this whole file
-- -> Run. Or, if you use the Supabase CLI: `supabase db push`.
--
-- Design notes for anyone new to this schema:
-- * We use UUIDs for primary keys so IDs are safe to expose in URLs
--   (/parts/<uuid>) without leaking how many rows exist (unlike 1,2,3...).
-- * "Catalog" tables (categories, brands, products, product_models, parts)
--   describe the CATEGORY -> PRODUCT -> BRAND -> MODEL -> PART hierarchy that
--   is the whole point of this marketplace: matching is only trustworthy
--   because we know the exact model/part, not just free text.
-- * Listings and need_requests ALSO store the brand/product/model/part as
--   plain text columns. Why duplicate data that's already in the catalog
--   tables? Because in the MVP, most brands/models won't exist in the
--   catalog yet (we can't pre-populate every product on Earth). Users type
--   free text, and we optionally link it to a catalog row when one matches.
--   This keeps the MVP usable on day one while still building toward a
--   proper structured catalog + compatibility graph over time.
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. PROFILES
-- One row per authenticated user, extending Supabase's built-in auth.users.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'New User',
  location text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. CATALOG: categories -> brands -> products -> product_models -> parts
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text,
  sort_order integer not null default 0
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique,
  name text not null
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (brand_id, slug)
);

-- A product can have multiple generations/versions ("2021", "Gen 2", etc).
-- version_label can be an empty string when there's no meaningful version.
create table if not exists public.product_models (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  version_label text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, version_label)
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.product_models (id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (model_id, slug)
);

-- ----------------------------------------------------------------------------
-- 3. FUTURE-READY: part_compatibility
-- Not used by the MVP matching engine (which does simple exact matching),
-- but the table exists now so "Version 2" compatibility scoring can be added
-- later without a schema migration that touches live data.
-- Meaning: part A is also compatible with product_model B.
-- ----------------------------------------------------------------------------
create table if not exists public.part_compatibility (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.parts (id) on delete cascade,
  compatible_model_id uuid not null references public.product_models (id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  unique (part_id, compatible_model_id)
);

-- ----------------------------------------------------------------------------
-- 4. LISTINGS ("I HAVE A PART")
-- ----------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,

  -- Optional links into the structured catalog (nullable: most MVP listings
  -- will be free text only, since the catalog starts nearly empty).
  category_id uuid references public.categories (id) on delete set null,
  brand_id uuid references public.brands (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  model_id uuid references public.product_models (id) on delete set null,
  part_id uuid references public.parts (id) on delete set null,

  -- Free-text fields: always present, always what the UI displays/searches.
  brand_name text not null,
  product_name text not null,
  model_label text,
  part_name text not null,

  condition text not null check (
    condition in ('New', 'Like New', 'Used - Working', 'Used - Good', 'Used - Fair', 'For Parts')
  ),
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'INR',
  description text not null default '',
  location text,

  status text not null default 'active' check (status in ('active', 'sold', 'removed')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null, -- path inside the "listing-images" Storage bucket
  sort_order integer not null default 0
);

-- ----------------------------------------------------------------------------
-- 5. NEED REQUESTS ("I NEED A PART")
-- ----------------------------------------------------------------------------
create table if not exists public.need_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,

  brand_name text not null,
  product_name text not null,
  model_label text,
  part_name text not null,

  description text,
  location text,
  status text not null default 'open' check (status in ('open', 'matched', 'closed')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. CONTACT REQUESTS (buyer -> seller, simple inbox - not real-time chat)
-- ----------------------------------------------------------------------------
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  message text not null,
  contact_info text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. INDEXES
-- Cover the columns the matching engine and browse/filter pages query most.
-- ----------------------------------------------------------------------------
create index if not exists idx_listings_seller on public.listings (seller_id);
create index if not exists idx_listings_status on public.listings (status);
create index if not exists idx_listings_category on public.listings (category_id);
create index if not exists idx_listings_brand_product_part
  on public.listings (lower(brand_name), lower(product_name), lower(part_name));
create index if not exists idx_listings_created_at on public.listings (created_at desc);
create index if not exists idx_listings_price on public.listings (price);

create index if not exists idx_need_requests_requester on public.need_requests (requester_id);
create index if not exists idx_need_requests_status on public.need_requests (status);
create index if not exists idx_need_requests_brand_product_part
  on public.need_requests (lower(brand_name), lower(product_name), lower(part_name));

create index if not exists idx_listing_images_listing on public.listing_images (listing_id);
create index if not exists idx_contact_requests_listing on public.contact_requests (listing_id);
create index if not exists idx_contact_requests_buyer on public.contact_requests (buyer_id);

create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_brands_category on public.brands (category_id);

-- Simple full-text search across the fields buyers actually search by.
alter table public.listings add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('simple',
      coalesce(brand_name, '') || ' ' ||
      coalesce(product_name, '') || ' ' ||
      coalesce(model_label, '') || ' ' ||
      coalesce(part_name, '') || ' ' ||
      coalesce(description, '')
    )
  ) stored;
create index if not exists idx_listings_search on public.listings using gin (search_vector);

-- ----------------------------------------------------------------------------
-- 8. updated_at trigger for listings
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute procedure public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Everything is locked down by default; each policy below opens exactly the
-- access that feature needs. This is what stops one user from editing or
-- deleting another user's listings, even if they tamper with client requests.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_models enable row level security;
alter table public.parts enable row level security;
alter table public.part_compatibility enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.need_requests enable row level security;
alter table public.contact_requests enable row level security;

-- Profiles: anyone can view (needed to show "Seller: Priya" on a listing),
-- but you can only edit/insert your own.
create policy "Profiles are publicly viewable"
  on public.profiles for select using (true);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Catalog tables: public read-only. Writes happen via the service role
-- (admin scripts / future admin panel), never directly from the browser.
create policy "Catalog is publicly readable" on public.categories for select using (true);
create policy "Catalog is publicly readable" on public.brands for select using (true);
create policy "Catalog is publicly readable" on public.products for select using (true);
create policy "Catalog is publicly readable" on public.product_models for select using (true);
create policy "Catalog is publicly readable" on public.parts for select using (true);
create policy "Catalog is publicly readable" on public.part_compatibility for select using (true);

-- Listings: anyone can view ACTIVE listings; only the owner can view/edit/
-- delete their own listings regardless of status (so they can see their own
-- sold/removed listings too).
create policy "Active listings are publicly viewable"
  on public.listings for select
  using (status = 'active' or auth.uid() = seller_id);
create policy "Users can create their own listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);
create policy "Users can update their own listings"
  on public.listings for update
  using (auth.uid() = seller_id);
create policy "Users can delete their own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- Listing images: viewable alongside their (visible) listing; only the
-- listing's owner can add/remove images.
create policy "Listing images follow listing visibility"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.status = 'active' or l.seller_id = auth.uid())
    )
  );
create policy "Owners can add images to their listings"
  on public.listing_images for insert
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id and l.seller_id = auth.uid()
    )
  );
create policy "Owners can delete images from their listings"
  on public.listing_images for delete
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id and l.seller_id = auth.uid()
    )
  );

-- Need requests: viewable by everyone (so sellers can browse unmet demand),
-- but only the requester can create/update/delete their own.
create policy "Need requests are publicly viewable"
  on public.need_requests for select using (true);
create policy "Users can create their own need requests"
  on public.need_requests for insert with check (auth.uid() = requester_id);
create policy "Users can update their own need requests"
  on public.need_requests for update using (auth.uid() = requester_id);
create policy "Users can delete their own need requests"
  on public.need_requests for delete using (auth.uid() = requester_id);

-- Contact requests: only visible to the buyer who sent it and the seller who
-- owns the listing it's about. Nobody else (not even other logged-in users)
-- can read someone else's contact message.
create policy "Buyer or seller can view a contact request"
  on public.contact_requests for select
  using (
    auth.uid() = buyer_id
    or auth.uid() in (select seller_id from public.listings where id = contact_requests.listing_id)
  );
create policy "Logged-in users can contact a seller"
  on public.contact_requests for insert
  with check (auth.uid() = buyer_id);
