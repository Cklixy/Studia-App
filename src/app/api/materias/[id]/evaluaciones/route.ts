import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createEvaluacionSchema } from "@/lib/validations/evaluaciones";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("evaluaciones")
    .select("id, nombre, porcentaje, nota_obtenida, materia_id, created_at")
    .eq("materia_id", params.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // 1. Validar tipos de datos y rangos (Zod)
    const validData = createEvaluacionSchema.parse(body);

    // 2. Regla de negocio matemática: El porcentaje total no debe exceder 100%
    const { data: existingEvaluaciones, error: fetchError } = await supabase
      .from("evaluaciones")
      .select("porcentaje")
      .eq("materia_id", params.id);

    if (fetchError) {
      throw new Error("No se pudo verificar el porcentaje actual.");
    }

    const currentTotal = existingEvaluaciones?.reduce((acc, curr) => acc + Number(curr.porcentaje), 0) || 0;
    
    if (currentTotal + validData.porcentaje > 100) {
      return NextResponse.json(
        { error: `El porcentaje ingresado supera el 100%. Actualmente llevas ${currentTotal}% evaluado.` },
        { status: 400 }
      );
    }

    // 3. Insertar
    const { data: newEvaluacion, error: insertError } = await supabase
      .from("evaluaciones")
      .insert([
        {
          materia_id: params.id,
          user_id: user.id,
          nombre: validData.nombre,
          porcentaje: validData.porcentaje,
          nota_obtenida: validData.nota_obtenida,
        },
      ])
      .select("id, nombre, porcentaje, nota_obtenida, materia_id, created_at")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newEvaluacion, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
