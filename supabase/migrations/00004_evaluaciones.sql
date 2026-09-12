-- 00004_evaluaciones.sql

-- Drop the old evaluaciones table which was tied to temas
DROP TABLE IF EXISTS evaluaciones;

-- Create the new evaluaciones table tied to materias
CREATE TABLE evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    porcentaje NUMERIC NOT NULL CHECK (porcentaje > 0 AND porcentaje <= 100),
    nota_obtenida NUMERIC CHECK (nota_obtenida >= 0 AND nota_obtenida <= 5.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE evaluaciones ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can only select their own evaluaciones" ON evaluaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert their own evaluaciones" ON evaluaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own evaluaciones" ON evaluaciones FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only delete their own evaluaciones" ON evaluaciones FOR DELETE USING (auth.uid() = user_id);
