import { z } from "zod";
import xss from "xss";

export const temaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(150, "El nombre no puede exceder los 150 caracteres")
    .transform((val) => xss(val)),
  tipo_contenido: z
    .enum(["Lectura", "Video", "Ejercicio", "Resumen", "Otro"])
    .default("Lectura"),
});

export type TemaInput = z.infer<typeof temaSchema>;
