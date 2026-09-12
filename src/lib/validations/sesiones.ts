import { z } from "zod";
import xss from "xss";

export const createSessionSchema = z.object({
  nivel_educativo: z.string().transform((val) => xss(val)),
  materia_id: z.string().uuid().optional().nullable(),
  materia_nombre: z.string().optional().transform((val) => val ? xss(val) : undefined), // Used if creating a new one on the fly
  tema_id: z.string().uuid().optional().nullable(),
  tema_nombre: z.string().optional().transform((val) => val ? xss(val) : undefined), // Used if creating a new one on the fly
  contexto: z.string().transform((val) => xss(val)),
  metodo_recomendado: z.string().transform((val) => xss(val)),
  metodo_utilizado: z.string().transform((val) => xss(val)),
  objetivo: z.string().transform((val) => xss(val)),
  duracion_planificada_minutos: z.number().int().min(1).max(600),
});

export const updateSessionSchema = z.object({
  tiempo_efectivo_segundos: z.number().int().min(0),
  pausas_count: z.number().int().min(0).default(0),
  resultado_logro: z.enum(["Sí", "Parcialmente", "No", "Si"]).transform(val => val === "Sí" ? "Si" : val),
  calificacion_utilidad: z.enum(["Sí mucho", "Sí", "Más o menos", "No", "Si mucho", "Si", "Mas o menos"]).transform(val => val.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
  calificacion_productividad: z.number().int().min(1).max(5),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
