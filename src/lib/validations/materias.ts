import { z } from "zod";
import xss from "xss";

export const materiaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .transform((val) => xss(val)),
  fecha_parcial: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return !isNaN(Date.parse(val));
    }, "Fecha inválida"),
});

export type MateriaInput = z.infer<typeof materiaSchema>;
