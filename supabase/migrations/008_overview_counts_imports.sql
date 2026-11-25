-- 008: the admin overview's "Products to review" count now includes products brought in by a spreadsheet import.
-- Same function as in 006, with one line changed.

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
    'products_to_review', (select count(*) from public.products where source in ('User-Added', 'Admin Import') and verified = false),
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
