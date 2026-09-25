import { createClient } from "@/utils/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";

export interface CachedTema {
  id: string;
  nombre: string;
  estado: string;
  created_at: string;
  orden: number | null;
  dificultad: string | null;
  minutos_estimados: number | null;
}

export interface CachedMateria {
  id: string;
  nombre: string;
  descripcion: string | null;
  fecha_parcial: string | null;
  created_at: string;
  temas?: CachedTema[];
}

/**
 * Obtiene el listado de materias del usuario aprovechando Next.js Data Cache
 * con { next: { revalidate: 180, tags: [...] } }.
 * Evita consultas redundantes a Supabase en cada request y acelera la carga.
 */
export async function getCachedMaterias(
  userId: string,
  accessToken?: string
): Promise<CachedMateria[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (accessToken && supabaseUrl && anonKey) {
    try {
      const query = encodeURIComponent(
        "id,nombre,descripcion,fecha_parcial,created_at,temas(id,nombre,estado,created_at,orden,dificultad,minutos_estimados)"
      );
      const url = `${supabaseUrl}/rest/v1/materias?select=${query}&order=created_at.desc`;

      const res = await fetch(url, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 180, // Cache de 3 minutos
          tags: ["materias", `materias-${userId}`],
        },
      });

      if (res.ok) {
        const data = await res.json();
        return (data || []) as CachedMateria[];
      }
      console.warn("fetch cached materias non-ok status:", res.status, res.statusText);
    } catch (fetchErr) {
      console.warn("fetch cached materias failed, using fallback client:", fetchErr);
    }
  }

  // Fallback seguro usando el cliente Supabase SSR
  const supabase = createClient();
  const { data, error } = await supabase
    .from("materias")
    .select(`
      id,
      nombre,
      descripcion,
      fecha_parcial,
      created_at,
      temas (
        id,
        nombre,
        estado,
        created_at,
        orden,
        dificultad,
        minutos_estimados
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching materias fallback:", error);
    return [];
  }

  return (data || []) as CachedMateria[];
}

/**
 * Invalida la caché de materias bajo demanda tras mutaciones (crear, editar, borrar).
 */
export async function revalidateMateriasCache(userId?: string) {
  try {
    revalidateTag("materias");
    if (userId) {
      revalidateTag(`materias-${userId}`);
    }
    revalidatePath("/hoy");
    revalidatePath("/materias");
    revalidatePath("/sesion/nueva");
    revalidatePath("/evaluaciones");
    revalidatePath("/historial");
  } catch (err) {
    console.warn("revalidateMateriasCache warning:", err);
  }
}
