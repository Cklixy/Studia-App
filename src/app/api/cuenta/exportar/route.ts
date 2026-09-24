import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// Descarga de los datos propios en JSON (derecho de acceso, Ley 1581 de 2012).
// Usa el cliente del usuario: RLS garantiza que solo salen sus filas.
const TABLAS = ["materias", "temas", "sesiones", "evaluaciones", "study_routes", "rachas", "recompensas"] as const;

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const datos: Record<string, unknown[]> = {};
  for (const tabla of TABLAS) {
    const { data, error } = await supabase.from(tabla).select("*").eq("user_id", user.id);
    if (error) {
      console.error(`Exportar ${tabla}:`, error);
      return NextResponse.json({ error: "No se pudieron exportar tus datos" }, { status: 500 });
    }
    datos[tabla] = data ?? [];
  }

  const exportacion = {
    generado: new Date().toISOString(),
    cuenta: { id: user.id, email: user.email, creada: user.created_at },
    ...datos,
  };

  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(exportacion, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="studia-mis-datos-${fecha}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
