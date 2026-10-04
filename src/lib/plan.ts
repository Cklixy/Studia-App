import type { SupabaseClient } from "@supabase/supabase-js";

// Planes y límites de uso mensual de la IA (plan de suscripciones).
// La fuente de verdad son las funciones SQL de la migración 00014 (consumir_uso_ia, estado_plan);
// aquí solo se llaman y se tipan. Free: 5 rutas y 20 mensajes; Pro: 50 rutas y 100 mensajes.

export type TipoUso = "ruta" | "mensaje";
export type Plan = "free" | "pro";

export const PRECIO_PRO_COP = 49999;
export const LIMITES: Record<Plan, Record<TipoUso, number>> = {
  free: { ruta: 5, mensaje: 20 },
  pro: { ruta: 50, mensaje: 100 },
};

export interface ResultadoConsumo {
  permitido: boolean;
  usados: number;
  limite: number;
  plan: Plan;
  reinicia_el: string; // AAAA-MM-DD
  /** true si la base de datos aún no tiene la migración: no se controla el uso */
  sinControl?: boolean;
}

export interface EstadoPlan {
  plan: Plan;
  pro_hasta: string | null;
  reinicia_el: string;
  rutas: { usados: number; limite: number };
  mensajes: { usados: number; limite: number };
}

/** Código que devuelve la API cuando se llega al tope (HTTP 402). */
export const CODIGO_LIMITE = "LIMITE_ALCANZADO";

// La función aún no existe en la base de datos (migración sin aplicar): PostgREST responde PGRST202
function faltaMigracion(error: { code?: string; message?: string } | null) {
  return !!error && (error.code === "PGRST202" || error.code === "42883" || /could not find the function/i.test(error.message || ""));
}

/**
 * Cuenta un uso si queda cupo, en una sola operación atómica en la base de datos.
 * Si la migración no está aplicada, deja pasar (y lo registra) para no romper la IA en producción.
 */
export async function consumirUsoIa(supabase: SupabaseClient, tipo: TipoUso): Promise<ResultadoConsumo> {
  const { data, error } = await supabase.rpc("consumir_uso_ia", { p_tipo: tipo });
  if (error) {
    if (faltaMigracion(error)) {
      console.warn("[plan] consumir_uso_ia no existe todavía: uso sin controlar. Aplica la migración 00014.");
      return { permitido: true, usados: 0, limite: LIMITES.free[tipo], plan: "free", reinicia_el: "", sinControl: true };
    }
    throw error;
  }
  return data as ResultadoConsumo;
}

/** Devuelve un uso si la IA falló: un intento fallido no cuenta. Nunca lanza. */
export async function devolverUsoIa(supabase: SupabaseClient, tipo: TipoUso, consumo: ResultadoConsumo) {
  if (consumo.sinControl) return;
  const { error } = await supabase.rpc("devolver_uso_ia", { p_tipo: tipo });
  if (error) console.error("[plan] No se pudo devolver el uso:", error.message);
}

/** Plan y consumo del mes; null si la migración no está aplicada. */
export async function obtenerEstadoPlan(supabase: SupabaseClient): Promise<EstadoPlan | null> {
  const { data, error } = await supabase.rpc("estado_plan");
  if (error) {
    if (!faltaMigracion(error)) console.error("[plan] estado_plan:", error.message);
    return null;
  }
  return data as EstadoPlan;
}

/** Respuesta HTTP 402 estándar al llegar al tope. */
export function cuerpoLimite(consumo: ResultadoConsumo, tipo: TipoUso) {
  const que = tipo === "ruta" ? "rutas con IA" : "mensajes al tutor";
  return {
    codigo: CODIGO_LIMITE,
    tipo,
    error: `Llegaste al límite de ${consumo.limite} ${que} de este mes.`,
    usados: consumo.usados,
    limite: consumo.limite,
    plan: consumo.plan,
    reinicia_el: consumo.reinicia_el,
  };
}

/** «1 de octubre» a partir de AAAA-MM-DD, sin correrse de día. */
export function fechaReinicio(fecha: string): string {
  if (!fecha) return "";
  return new Date(`${fecha}T12:00:00Z`).toLocaleDateString("es-CO", { day: "numeric", month: "long", timeZone: "America/Bogota" });
}

/** Pro sin vencimiento: se otorga con una fecha muy lejana (año 2090 o después). */
export function esProPermanente(iso: string | null): boolean {
  return !!iso && new Date(iso).getUTCFullYear() >= 2090;
}

/** «Tu Pro está activo hasta el 28 de octubre.» o «Tu Pro no vence.» */
export function textoVigenciaPro(iso: string | null): string {
  return esProPermanente(iso) ? "Tu Pro no vence." : `Tu Pro está activo hasta el ${fechaVencimiento(iso)}.`;
}

/** «28 de octubre» a partir de un timestamp (pro_hasta), en hora de Colombia. */
export function fechaVencimiento(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", timeZone: "America/Bogota" });
}
