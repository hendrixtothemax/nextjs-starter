-- Ensure the bucket exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 1. Public Access: Anyone can view avatars
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- 2. User Upload Access: Any authenticated user can upload
create policy "User Upload Access"
  on storage.objects for insert
  with check ( 
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated' 
  );

-- 3. User Update Access: Only the owner can update their own file
create policy "User Update Access"
  on storage.objects for update
  using ( 
    bucket_id = 'avatars' 
    and auth.uid() = owner 
  );

-- 4. User Delete Access: Only the owner can delete their own file
create policy "User Delete Access"
  on storage.objects for delete
  using ( 
    bucket_id = 'avatars' 
    and auth.uid() = owner 
  );