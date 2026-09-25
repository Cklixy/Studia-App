-- C1 (auditoría 2026-09): get_subscriptions_for_inactive_users() es SECURITY DEFINER y devuelve
-- suscripciones push; solo debe ejecutarla el cron (service_role). La 00010 ya lo hacía, pero
-- nunca se aplicó en producción.
begin;
revoke execute on function public.get_subscriptions_for_inactive_users() from public;
revoke execute on function public.get_subscriptions_for_inactive_users() from anon;
revoke execute on function public.get_subscriptions_for_inactive_users() from authenticated;
grant  execute on function public.get_subscriptions_for_inactive_users() to service_role;
commit;
