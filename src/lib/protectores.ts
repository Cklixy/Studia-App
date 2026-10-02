import type { SupabaseClient } from "@supabase/supabase-js";

// Protectores de racha (migración 00016): Free 1 al mes, Pro 3. La fuente de verdad son las funciones
// SQL; aquí solo se llaman. Si la migración aún no está aplicada, todo se comporta como sin protectores.

export const PROTECTORES = { free: 1, pro: 3 } as const;

export interface EstadoProtectores {
  plan: "free" | "pro";
  limite: number;
  usados: number;
  disponibles: number;
}

const faltaMigracion = (error: { code?: string; message?: string } | null) =>
  !!error && (error.code === "PGRST202" || error.code === "42883" || /could not find the function/i.test(error.message || ""));

/** Protectores del mes; null si la migración no está aplicada. */
export async function obtenerEstadoProtectores(supabase: SupabaseClient): Promise<EstadoProtectores | null> {
  const { data, error } = await supabase.rpc("estado_protectores");
  if (error) {
    if (!faltaMigracion(error)) console.error("[protectores] estado_protectores:", error.message);
    return null;
  }
  return data as EstadoProtectores;
}

/** Cubre con protectores los días perdidos desde `ultimaActividad`. ok = la racha sigue viva. */
export async function consumirProtectores(
  supabase: SupabaseClient,
  ultimaActividad: string | null
): Promise<{ ok: boolean; protegidos: number }> {
  if (!ultimaActividad) return { ok: false, protegidos: 0 };
  const { data, error } = await supabase.rpc("consumir_protectores", { p_ultima_actividad: ultimaActividad });
  if (error) {
    if (!faltaMigracion(error)) console.error("[protectores] consumir_protectores:", error.message);
    return { ok: false, protegidos: 0 };
  }
  return data as { ok: boolean; protegidos: number };
}

/** Fechas (AAAA-MM-DD) cubiertas por un protector, para marcarlas en la semana y el calendario. */
export async function obtenerDiasProtegidos(supabase: SupabaseClient, userId: string, desde: string): Promise<Set<string>> {
  const { data } = await supabase.from("dias_protegidos").select("fecha").eq("user_id", userId).gte("fecha", desde);
  return new Set((data || []).map((d: { fecha: string }) => d.fecha));
}
