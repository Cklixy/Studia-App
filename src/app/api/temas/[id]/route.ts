import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateMateriasCache } from "@/lib/data/materias";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const temaId = params.id;
    const body = await request.json();
    
    let updates: any = {};
    if (body.completed !== undefined) {
      updates.estado = Boolean(body.completed) ? 'completado' : 'pendiente';
    }
    if (body.nombre !== undefined) {
      updates.nombre = body.nombre;
    }

    const { data, error } = await supabase
      .from("temas")
      .update(updates)
      .eq("id", temaId)
      .select("id, nombre, estado, materia_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await revalidateMateriasCache(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

