-- SkinSabi 006: owner-only admin access, and review moderation that people cannot skip.
-- Run after 005. Safe to run more than once.
--
-- Who is an admin: a row in public.admin_users, matched by USER ID, never by email. While "Confirm email" is off,
-- anyone can sign up with any email address, so an email match would let a stranger become admin.
-- On top of that, is_admin() only says yes when the current session came from a Google (OAuth) sign-in, so a password
-- that someone set on the owner's email before the owner arrived cannot open the admin page.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No policies and no grants: nobody can read or change this list through the API. The owner adds an admin in the SQL editor.
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
     and exists (select 1 from jsonb_array_elements(coalesce((select auth.jwt()) -> 'amr', '[]'::jsonb)) m where m ->> 'method' = 'oauth');
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Products: only admins can edit, verify or delete (people can still suggest new, unverified ones).
grant update, delete on public.products to authenticated;
drop policy if exists "Admin updates products" on public.products;
create policy "Admin updates products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admin deletes products" on public.products;
create policy "Admin deletes products" on public.products for delete to authenticated using ((select public.is_admin()));

-- Reviews: people could edit their own review row, including its status, which skips moderation.
-- Remove that. Only admins change a review, and only its status.
drop policy if exists "Users edit own reviews" on public.reviews;
drop policy if exists "Users update own reviews" on public.reviews;
revoke update on public.reviews from anon, authenticated;
revoke delete on public.reviews from anon, authenticated;
grant update (status) on public.reviews to authenticated;
drop policy if exists "Admin reads all reviews" on public.reviews;
create policy "Admin reads all reviews" on public.reviews for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admin moderates reviews" on public.reviews;
create policy "Admin moderates reviews" on public.reviews for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- A new review always starts as Pending with no helpful votes, whatever the browser sends.
create or replace function public.reviews_start_pending() returns trigger language plpgsql set search_path = '' as $$
begin
  new.status := 'Pending';
  new.helpful_count := 0;
  return new;
end;
$$;
revoke execute on function public.reviews_start_pending() from public, anon, authenticated;
drop trigger if exists reviews_start_pending on public.reviews;
create trigger reviews_start_pending before insert on public.reviews for each row execute function public.reviews_start_pending();

-- Import logs: admins can read them.
grant select on public.import_logs to authenticated;
drop policy if exists "Admin reads import logs" on public.import_logs;
create policy "Admin reads import logs" on public.import_logs for select to authenticated using ((select public.is_admin()));

-- Totals for the admin overview. Counts only, no personal details.
create or replace function public.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'users', (select count(*) from public.profiles),
    'new_7d', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'profiles_filled', (select count(*) from public.profiles where skin_type is not null),
    'products_to_review', (select count(*) from public.products where source = 'User-Added' and verified = false),
    'reviews_pending', (select count(*) from public.reviews where status = 'Pending'),
    'reviews_flagged', (select count(*) from public.reviews where status = 'Flagged'),
    'by_skin_type', (select coalesce(jsonb_object_agg(k, c), '{}'::jsonb) from (select coalesce(skin_type, 'Not set') as k, count(*) as c from public.profiles group by 1) t),
    'by_concern', (select coalesce(jsonb_object_agg(k, c), '{}'::jsonb) from (select coalesce(main_concern, 'Not set') as k, count(*) as c from public.profiles group by 1) t),
    'by_budget', (select coalesce(jsonb_object_agg(k, c), '{}'::jsonb) from (select coalesce(budget, 'Not set') as k, count(*) as c from public.profiles group by 1) t),
    'by_state', (select coalesce(jsonb_object_agg(k, c), '{}'::jsonb) from (select state as k, count(*) as c from public.profiles where state is not null and state <> '' group by 1 order by 2 desc limit 10) t)
  ) into result;
  return result;
end;
$$;
revoke execute on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;
