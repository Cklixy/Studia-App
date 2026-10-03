import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { obtenerMetodosDescartados } from "@/lib/metodos";

export const dynamic = "force-dynamic";

// Métodos que la persona calificó con «No me funcionó». El asistente de sesión los usa para no
// recomendarlos cuando la IA no responde y toca el motor de reglas del navegador.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ descartados: await obtenerMetodosDescartados(supabase, user.id) });
}
