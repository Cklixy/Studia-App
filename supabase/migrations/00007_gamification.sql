-- 00007_gamification.sql

-- Add columns for gamification
ALTER TABLE rachas
ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nivel_actual INTEGER DEFAULT 1;

-- Also we create an upsert constraint by making user_id unique (if it's not already)
-- Wait, rachas ID is primary key, but there should be only one racha per user.
-- Let's ensure user_id is UNIQUE.
ALTER TABLE rachas ADD CONSTRAINT rachas_user_id_key UNIQUE (user_id);

-- Fix the cron helper function from Shift 8 to correctly check `estado = 'finalizada'` instead of `completada = true`
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
    WHERE s.estado = 'finalizada' 
    AND s.created_at >= CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;
