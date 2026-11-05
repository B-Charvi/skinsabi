-- The signup trigger function should only run as a trigger, never be called from the public API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
