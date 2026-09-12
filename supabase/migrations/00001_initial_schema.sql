-- Supabase Schema for studia+ (Shift 1)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: materias
CREATE TABLE materias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: temas
CREATE TABLE temas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: evaluaciones
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tema_id UUID NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    puntaje NUMERIC NOT NULL,
    comentarios TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table: sesiones
CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duracion_minutos INTEGER NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: rachas
CREATE TABLE rachas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dias INTEGER NOT NULL DEFAULT 0,
    ultima_actividad DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table: recompensas
CREATE TABLE recompensas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    desbloqueado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) en todas las tablas
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE temas ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE rachas ENABLE ROW LEVEL SECURITY;
ALTER TABLE recompensas ENABLE ROW LEVEL SECURITY;

-- Crear políticas (Policies) para restringir el acceso solo a los dueños de los datos

-- Políticas para materias
CREATE POLICY "Users can only select their own materias" ON materias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own materias" ON materias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own materias" ON materias FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own materias" ON materias FOR DELETE USING (auth.uid() = user_id);

-- Políticas para temas
CREATE POLICY "Users can only select their own temas" ON temas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own temas" ON temas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own temas" ON temas FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own temas" ON temas FOR DELETE USING (auth.uid() = user_id);

-- Políticas para evaluaciones
CREATE POLICY "Users can only select their own evaluaciones" ON evaluaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own evaluaciones" ON evaluaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own evaluaciones" ON evaluaciones FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own evaluaciones" ON evaluaciones FOR DELETE USING (auth.uid() = user_id);

-- Políticas para sesiones
CREATE POLICY "Users can only select their own sesiones" ON sesiones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own sesiones" ON sesiones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own sesiones" ON sesiones FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own sesiones" ON sesiones FOR DELETE USING (auth.uid() = user_id);

-- Políticas para rachas
CREATE POLICY "Users can only select their own rachas" ON rachas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own rachas" ON rachas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own rachas" ON rachas FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own rachas" ON rachas FOR DELETE USING (auth.uid() = user_id);

-- Políticas para recompensas
CREATE POLICY "Users can only select their own recompensas" ON recompensas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own recompensas" ON recompensas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own recompensas" ON recompensas FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own recompensas" ON recompensas FOR DELETE USING (auth.uid() = user_id);
