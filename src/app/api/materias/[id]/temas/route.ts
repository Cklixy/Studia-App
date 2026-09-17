import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { temaSchema } from "@/lib/validations/temas";
import { revalidateMateriasCache } from "@/lib/data/materias";
import { z } from "zod";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const materiaId = params.id;

  const { data: temas, error } = await supabase
    .from("temas")
    .select("id, nombre, estado, tipo_contenido, orden, created_at, materia_id")
    .eq("materia_id", materiaId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(temas);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materiaId = params.id;
    const body = await request.json();
    
    const validatedData = temaSchema.parse(body);

    const { data, error } = await supabase
      .from("temas")
      .insert({
        user_id: user.id,
        materia_id: materiaId,
        nombre: validatedData.nombre,
        tipo_contenido: validatedData.tipo_contenido,
        estado: 'pendiente'
      })
      .select("id, nombre, estado, tipo_contenido, orden, created_at, materia_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await revalidateMateriasCache(user.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
