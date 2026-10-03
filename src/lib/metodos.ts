import type { SupabaseClient } from "@supabase/supabase-js";

// Métodos de estudio que a la persona no le funcionaron: se deducen de cómo calificó sus sesiones
// (calificacion_utilidad = «No» para el método usado), sin tabla nueva. Dejan de recomendarse
// mientras esa sea su calificación más reciente de ese método y tenga menos de DIAS_VIGENCIA días:
// pasado ese tiempo se puede volver a probar.

export const DIAS_VIGENCIA = 90;

/** Minúsculas, sin tildes ni signos: «Técnica Pomodoro + Resumen» → «tecnica pomodoro resumen». */
export function normalizarMetodo(metodo: string): string {
  return metodo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Mismo método (o uno que contiene al otro, p. ej. «Pomodoro» y «Técnica Pomodoro + Resumen»). */
export function mismoMetodo(a: string, b: string): boolean {
  const x = normalizarMetodo(a);
  const y = normalizarMetodo(b);
  if (!x || !y) return false;
  if (x === y) return true;
  return x.length >= 6 && y.length >= 6 && (x.includes(y) || y.includes(x));
}

export const estaDescartado = (metodo: string, descartados: string[]) => descartados.some((d) => mismoMetodo(metodo, d));

interface FilaSesion {
  metodo_utilizado: string | null;
  calificacion_utilidad: string | null;
  hora_finalizacion: string | null;
}

/** De las sesiones (más recientes primero), los métodos cuya última calificación fue «No». */
export function metodosDescartados(filas: FilaSesion[], ahora: number = Date.now()): string[] {
  const limite = ahora - DIAS_VIGENCIA * 86_400_000;
  const vistos = new Set<string>();
  const descartados: string[] = [];
  for (const f of filas) {
    if (!f.metodo_utilizado || !f.calificacion_utilidad) continue;
    const clave = normalizarMetodo(f.metodo_utilizado);
    if (!clave || vistos.has(clave)) continue; // solo cuenta la calificación más reciente de cada método
    vistos.add(clave);
    const fecha = f.hora_finalizacion ? Date.parse(f.hora_finalizacion) : NaN;
    if (f.calificacion_utilidad === "No" && fecha >= limite) descartados.push(f.metodo_utilizado);
  }
  return descartados;
}

/** Métodos que no le funcionaron a la persona (consulta con su sesión: RLS limita a lo suyo). */
export async function obtenerMetodosDescartados(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("sesiones")
    .select("metodo_utilizado, calificacion_utilidad, hora_finalizacion")
    .eq("user_id", userId)
    .eq("estado", "finalizada")
    .not("metodo_utilizado", "is", null)
    .not("calificacion_utilidad", "is", null)
    .order("hora_finalizacion", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[metodos] No se pudieron leer los métodos descartados:", error.message);
    return [];
  }
  return metodosDescartados((data || []) as FilaSesion[]);
}
