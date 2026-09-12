import { z } from "zod";

export const createEvaluacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre es muy largo"),
  porcentaje: z.coerce
    .number()
    .positive("El porcentaje debe ser mayor a 0")
    .max(100, "El porcentaje no puede ser mayor a 100"),
  nota_obtenida: z.coerce
    .number()
    .min(0, "La nota no puede ser negativa")
    .max(5.0, "La nota no puede ser mayor a 5.0")
    .optional()
    .nullable(),
});
