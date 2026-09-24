import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("evaluaciones")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id); // M6: filtro propietario — defensa en profundidad sobre RLS

  if (error) {
    // M7: Error genérico — no exponer error.message interno
    return NextResponse.json({ error: "Error al eliminar la evaluación" }, { status: 500 });
  }

  return NextResponse.json({ message: "Evaluación eliminada" }, { status: 200 });
}
