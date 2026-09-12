-- 1. Create study_routes table
CREATE TABLE study_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    materia_id UUID REFERENCES materias(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt_original TEXT,
    nivel_educativo TEXT,
    objetivo TEXT,
    tiempo_diario TEXT,
    estado TEXT DEFAULT 'DRAFT', -- DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED
    ai_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Modificar tabla temas para agregar columnas requeridas por AI routes
ALTER TABLE temas 
ADD COLUMN route_id UUID REFERENCES study_routes(id) ON DELETE CASCADE,
ADD COLUMN orden INTEGER,
ADD COLUMN dificultad TEXT,
ADD COLUMN minutos_estimados INTEGER,
ADD COLUMN ai_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN descripcion TEXT;

-- 3. Crear tabla de dependencias (topic_dependencies)
CREATE TABLE topic_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    depende_de_tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    UNIQUE(tema_id, depende_de_tema_id)
);

-- 4. Habilitar RLS y crear políticas

ALTER TABLE study_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only select their own study_routes" ON study_routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own study_routes" ON study_routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own study_routes" ON study_routes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own study_routes" ON study_routes FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE topic_dependencies ENABLE ROW LEVEL SECURITY;
-- Dependencias pertenecen al mismo user dueño del tema (lo podemos chequear a traves del join, pero es mas simple dejarlo asi si insertamos validado del backend)
-- Para simplicidad en RLS, como esta asociado a temas, hacemos el join con temas para validar el user_id
CREATE POLICY "Users can only select their own topic_dependencies" ON topic_dependencies FOR SELECT USING (
  EXISTS (SELECT 1 FROM temas WHERE temas.id = topic_dependencies.tema_id AND temas.user_id = auth.uid())
);
CREATE POLICY "Users can only insert their own topic_dependencies" ON topic_dependencies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM temas WHERE temas.id = topic_dependencies.tema_id AND temas.user_id = auth.uid())
);
CREATE POLICY "Users can only update their own topic_dependencies" ON topic_dependencies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM temas WHERE temas.id = topic_dependencies.tema_id AND temas.user_id = auth.uid())
);
CREATE POLICY "Users can only delete their own topic_dependencies" ON topic_dependencies FOR DELETE USING (
  EXISTS (SELECT 1 FROM temas WHERE temas.id = topic_dependencies.tema_id AND temas.user_id = auth.uid())
);
