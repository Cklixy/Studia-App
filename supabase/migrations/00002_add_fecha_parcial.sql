-- 00002_add_fecha_parcial.sql
-- Add fecha_parcial to materias
ALTER TABLE materias ADD COLUMN fecha_parcial DATE;

-- Add tipo_contenido to temas
ALTER TABLE temas ADD COLUMN tipo_contenido TEXT DEFAULT 'Lectura';
