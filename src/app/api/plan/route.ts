import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { obtenerEstadoPlan } from "@/lib/plan";

// Plan y consumo del mes del usuario, para los contadores del cliente (Crear ruta y el tutor).
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const estado = await obtenerEstadoPlan(supabase);
  return NextResponse.json(estado, { headers: { "Cache-Control": "no-store" } });
}
