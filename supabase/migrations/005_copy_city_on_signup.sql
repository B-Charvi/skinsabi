-- SkinSabi 005: the signup trigger now also copies the city chosen at signup.
-- Safe to run more than once. Run it after 004_lock_down_signup_function.sql.
-- create or replace keeps the privileges set in 004, so the function stays closed to the public API.

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, skin_type, main_concern, budget, state, city)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'skin_type', ''),
    nullif(new.raw_user_meta_data ->> 'main_concern', ''),
    nullif(new.raw_user_meta_data ->> 'budget', ''),
    nullif(new.raw_user_meta_data ->> 'state', ''),
    nullif(new.raw_user_meta_data ->> 'city', '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
