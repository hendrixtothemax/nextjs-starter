-- Create the function that performs the sync
create or replace function public.handle_email_update()
returns trigger as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function whenever an email is updated in auth.users
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row
  execute procedure public.handle_email_update();