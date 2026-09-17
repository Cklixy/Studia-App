import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { materiaSchema } from "@/lib/validations/materias";
import { revalidateMateriasCache } from "@/lib/data/materias";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: materias, error } = await supabase
    .from("materias")
    .select("id, nombre, descripcion, fecha_parcial, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(materias);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Zod will parse, validate length and sanitize with xss
    const validatedData = materiaSchema.parse(body);

    const { data, error } = await supabase
      .from("materias")
      .insert({
        user_id: user.id,
        nombre: validatedData.nombre,
        fecha_parcial: validatedData.fecha_parcial || null,
      })
      .select("id, nombre, descripcion, fecha_parcial, created_at")
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
