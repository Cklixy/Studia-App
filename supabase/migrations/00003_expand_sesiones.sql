-- 00003_expand_sesiones.sql

-- Drop the old table because we are significantly altering the core structure and we don't have production data yet.
DROP TABLE IF EXISTS sesiones;

CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    materia_id UUID REFERENCES materias(id) ON DELETE SET NULL,
    tema_id UUID REFERENCES temas(id) ON DELETE SET NULL,
    nivel_educativo TEXT,
    contexto TEXT,
    metodo_recomendado TEXT,
    metodo_utilizado TEXT,
    objetivo TEXT,
    duracion_planificada_minutos INTEGER NOT NULL,
    hora_inicio TIMESTAMP WITH TIME ZONE,
    hora_finalizacion TIMESTAMP WITH TIME ZONE,
    tiempo_efectivo_segundos INTEGER DEFAULT 0,
    pausas_count INTEGER DEFAULT 0,
    estado TEXT DEFAULT 'activa', -- activa, finalizada
    resultado_logro TEXT, -- Si, Parcialmente, No
    calificacion_utilidad TEXT, -- Si mucho, Si, Mas o menos, No
    calificacion_productividad INTEGER CHECK (calificacion_productividad >= 1 AND calificacion_productividad <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only select their own sesiones" ON sesiones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own sesiones" ON sesiones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own sesiones" ON sesiones FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own sesiones" ON sesiones FOR DELETE USING (auth.uid() = user_id);
