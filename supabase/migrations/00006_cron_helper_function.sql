-- 00006_cron_helper_function.sql

-- Drop the function if it already exists
DROP FUNCTION IF EXISTS get_subscriptions_for_inactive_users;

-- Create a function that bypasses RLS (SECURITY DEFINER)
-- to get push subscriptions ONLY for users who haven't completed a session today.
CREATE OR REPLACE FUNCTION get_subscriptions_for_inactive_users()
RETURNS TABLE(user_id UUID, endpoint TEXT, p256dh TEXT, auth TEXT) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ps.user_id, ps.endpoint, ps.p256dh, ps.auth
  FROM push_subscriptions ps
  WHERE ps.user_id NOT IN (
    -- Users who have studied today
    SELECT s.user_id 
    FROM sesiones s 
    WHERE s.completada = true 
    AND s.created_at >= CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;
