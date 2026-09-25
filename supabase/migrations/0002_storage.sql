-- ============================================================================
-- Storage bucket for listing photos.
-- Run this after 0001_init_schema.sql.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Anyone can view listing photos (they're public marketplace photos).
create policy "Listing images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Only logged-in users can upload, and only into a folder named after their
-- own user id (e.g. "<user-id>/photo1.jpg"). This stops user A from
-- uploading files that look like they belong to user B.
create policy "Users can upload their own listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
