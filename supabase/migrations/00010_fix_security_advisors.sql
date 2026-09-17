-- 00010_fix_security_advisors.sql
-- Solución para advertencias del linter de Supabase:
-- 1. function_search_path_mutable: Define search_path fijo (public) para mitigar secuestro de search_path
-- 2. anon_security_definer_function_executable: Revoca permiso EXECUTE al rol anon y PUBLIC
-- 3. authenticated_security_definer_function_executable: Revoca permiso EXECUTE al rol authenticated
-- Solo service_role podrá ejecutar esta función administrativa de Web Push.

CREATE OR REPLACE FUNCTION public.get_subscriptions_for_inactive_users()
RETURNS TABLE(user_id UUID, endpoint TEXT, p256dh TEXT, auth TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT ps.user_id, ps.endpoint, ps.p256dh, ps.auth
  FROM public.push_subscriptions ps
  WHERE ps.user_id NOT IN (
    -- Usuarios que ya finalizaron al menos una sesión de estudio hoy
    SELECT s.user_id 
    FROM public.sesiones s 
    WHERE s.estado = 'finalizada' 
    AND s.created_at >= CURRENT_DATE
  );
END;
$$;

-- Revocar permisos públicos para evitar exposición de suscripciones Push por la API REST
REVOKE EXECUTE ON FUNCTION public.get_subscriptions_for_inactive_users() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_subscriptions_for_inactive_users() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_subscriptions_for_inactive_users() FROM authenticated;

-- Otorgar ejecución exclusivamente a service_role (backend cron jobs y scripts administrativos)
GRANT EXECUTE ON FUNCTION public.get_subscriptions_for_inactive_users() TO service_role;
