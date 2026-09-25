"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const METAS_VALIDAS = [120, 240, 360, 480, 600];

/**
 * Guarda la meta semanal (minutos) en los metadatos del usuario. En el servidor para no cargar
 * supabase-js en el navegador solo por este botón (~70 kB).
 */
export async function guardarMetaSemanal(minutos: number | null): Promise<{ ok: boolean }> {
  if (minutos !== null && !METAS_VALIDAS.includes(minutos)) return { ok: false };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { error } = await supabase.auth.updateUser({ data: { meta_semanal_minutos: minutos } });
  if (error) return { ok: false };
  revalidatePath("/materias");
  return { ok: true };
}
