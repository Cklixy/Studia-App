-- Migration 00009: Performance Indexes for Foreign Keys, RLS and Filter Columns
-- Based on Supabase Postgres Best Practices:
-- 1. Index all foreign keys to avoid full table sequential scans during joins and cascades.
-- 2. Index user_id on all tables protected by RLS (auth.uid() = user_id).
-- 3. Composite indexes for high-frequency queries (dashboard metrics, history filters, active routes).

-- 1. Table: materias
CREATE INDEX IF NOT EXISTS idx_materias_user_id 
  ON materias(user_id);

-- 2. Table: temas
CREATE INDEX IF NOT EXISTS idx_temas_materia_id 
  ON temas(materia_id);

CREATE INDEX IF NOT EXISTS idx_temas_user_id 
  ON temas(user_id);

CREATE INDEX IF NOT EXISTS idx_temas_route_id 
  ON temas(route_id);

CREATE INDEX IF NOT EXISTS idx_temas_materia_orden 
  ON temas(materia_id, orden);

-- 3. Table: sesiones (High read/write traffic during focus runs & stats)
CREATE INDEX IF NOT EXISTS idx_sesiones_user_id 
  ON sesiones(user_id);

CREATE INDEX IF NOT EXISTS idx_sesiones_materia_id 
  ON sesiones(materia_id);

CREATE INDEX IF NOT EXISTS idx_sesiones_tema_id 
  ON sesiones(tema_id);

-- Composite index covering dashboard metric queries:
-- WHERE user_id = $1 AND estado = 'finalizada' AND hora_finalizacion >= $2
CREATE INDEX IF NOT EXISTS idx_sesiones_user_estado_hora 
  ON sesiones(user_id, estado, hora_finalizacion DESC);

-- 4. Table: evaluaciones
CREATE INDEX IF NOT EXISTS idx_evaluaciones_materia_id 
  ON evaluaciones(materia_id);

CREATE INDEX IF NOT EXISTS idx_evaluaciones_user_id 
  ON evaluaciones(user_id);

-- 5. Table: rachas
CREATE INDEX IF NOT EXISTS idx_rachas_user_id 
  ON rachas(user_id);

-- 6. Table: study_routes
CREATE INDEX IF NOT EXISTS idx_study_routes_materia_estado 
  ON study_routes(materia_id, estado);

CREATE INDEX IF NOT EXISTS idx_study_routes_user_id 
  ON study_routes(user_id);

-- 7. Table: topic_dependencies
CREATE INDEX IF NOT EXISTS idx_topic_dependencies_tema 
  ON topic_dependencies(tema_id);

CREATE INDEX IF NOT EXISTS idx_topic_dependencies_depende 
  ON topic_dependencies(depende_de_tema_id);

-- 8. Table: recompensas
CREATE INDEX IF NOT EXISTS idx_recompensas_user_id 
  ON recompensas(user_id);

-- 9. Table: push_subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id 
  ON push_subscriptions(user_id);
