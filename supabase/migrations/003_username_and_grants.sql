-- SkinSabi 003: username on profiles, state copied at signup, and explicit table grants.
-- Safe to run more than once. Run it after 001_init.sql and 002_app_flows.sql.

alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9_]{3,24}$');

alter table public.profiles drop constraint if exists profiles_state_length;
alter table public.profiles add constraint profiles_state_length
  check (state is null or char_length(state) <= 40);

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username)) where username is not null;

-- Same function and trigger as 001, now also copying the state and city chosen at signup.
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

-- Since 30 October 2026 Supabase no longer exposes new tables to the API automatically.
-- Row Level Security (already enabled in 001 and 002) still decides which rows each person can touch.
grant select on public.products, public.ingredients, public.dermatologists to anon, authenticated;
grant insert on public.products to authenticated;
grant select on public.reviews, public.product_prices to anon, authenticated;
grant insert, update on public.reviews to authenticated;
grant insert on public.product_prices to authenticated;
grant select, insert, update, delete on public.user_products, public.check_ins, public.user_routines, public.photo_deletions to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;
