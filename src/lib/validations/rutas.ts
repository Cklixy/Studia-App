import { z } from "zod";
import xss from "xss";

// Tema de una ruta generada por la IA y revisado por el estudiante en /rutas/preview
const temaRutaSchema = z.object({
  nombre: z.string().min(1).max(200).transform((val) => xss(val)),
  descripcion: z.string().max(1000).optional().nullable().transform((val) => (val ? xss(val) : null)),
  dificultad: z.string().max(40).optional().nullable().transform((val) => (val ? xss(val) : null)),
  minutos_estimados: z.coerce.number().int().min(1).max(600).optional().nullable(),
});

// Antes /api/rutas no validaba el cuerpo (el resto de rutas sí): nombres sin sanear y
// cualquier número de temas.
export const rutaSchema = z
  .object({
    materia_id: z.string().uuid().optional().nullable(),
    materia_nombre: z.string().min(1).max(100).transform((val) => xss(val)).optional().nullable(),
    titulo_ruta: z.string().max(200).optional().nullable().transform((val) => (val ? xss(val) : null)),
    prompt_original: z.string().max(2000).optional().nullable().transform((val) => (val ? xss(val) : null)),
    temas: z.array(temaRutaSchema).min(1, "Faltan temas en la ruta").max(20),
  })
  .refine((d) => d.materia_id || d.materia_nombre, {
    message: "Se requiere un ID de materia o un nombre",
  });

export type RutaInput = z.infer<typeof rutaSchema>;
