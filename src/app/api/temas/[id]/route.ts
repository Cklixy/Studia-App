import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateMateriasCache } from "@/lib/data/materias";
import { z } from "zod";
import xss from "xss";

// M6: Esquema de validación para PATCH
const patchTemaSchema = z.object({
  completed: z.boolean().optional(),
  nombre: z.string().min(1).max(200).transform((val) => xss(val)).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const temaId = params.id;
    const body = await request.json();

    // M6: Validar y sanear el cuerpo antes de procesar
    const parsed = patchTemaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    let updates: any = {};
    if (parsed.data.completed !== undefined) {
      updates.estado = Boolean(parsed.data.completed) ? "completado" : "pendiente";
    }
    if (parsed.data.nombre !== undefined) {
      updates.nombre = parsed.data.nombre;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("temas")
      .update(updates)
      .eq("id", temaId)
      .eq("user_id", user.id) // M6: filtro propietario — defensa en profundidad sobre RLS
      .select("id, nombre, estado, materia_id")
      .single();

    if (error) {
      // M7: Error genérico — no exponer error.message interno
      return NextResponse.json({ error: "Error al actualizar el tema" }, { status: 500 });
    }

    await revalidateMateriasCache(user.id);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("temas")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id); // M6: filtro propietario — defensa en profundidad sobre RLS

    if (error) {
      // M7: Error genérico
      return NextResponse.json({ error: "Error al eliminar el tema" }, { status: 500 });
    }

    await revalidateMateriasCache(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
