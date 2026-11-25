-- 007: spreadsheet import for the admin page.
--
-- 1. The admin can add products and record each import run.
-- 2. Products added by an import (source = 'Admin Import') stay hidden from the public until the admin verifies them.
--    Every other product is visible exactly as before.
--
-- is_admin() is only callable by signed-in users, so it is never used in a rule that anonymous visitors evaluate.
-- That is why the public rule and the admin rule are two separate policies.

create policy "Admin adds products" on public.products
  for insert to authenticated
  with check ((select public.is_admin()));

alter policy "Public can read products" on public.products
  using (verified or source <> 'Admin Import');

create policy "Admin reads all products" on public.products
  for select to authenticated
  using ((select public.is_admin()));

create policy "Admin writes import logs" on public.import_logs
  for insert to authenticated
  with check ((select public.is_admin()));
