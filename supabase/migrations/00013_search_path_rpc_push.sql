-- Fija el search_path de la función SECURITY DEFINER (advisor function_search_path_mutable).
-- La 00010 lo hacía con CREATE OR REPLACE, pero nunca se aplicó en producción.
alter function public.get_subscriptions_for_inactive_users() set search_path = public, pg_temp;
