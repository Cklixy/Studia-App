import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createSessionSchema } from "@/lib/validations/sesiones";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSessionSchema.parse(body);

    let finalMateriaId = validatedData.materia_id;
    let finalTemaId = validatedData.tema_id;

    // Si pasaron nombre de materia y no ID, la creamos (ej: materia predefinida no guardada aún o personalizada)
    if (!finalMateriaId && validatedData.materia_nombre) {
      const { data: nuevaMateria, error: errMat } = await supabase
        .from("materias")
        .insert({
          user_id: user.id,
          nombre: validatedData.materia_nombre,
        })
        .select("id, nombre")
        .single();
      
      if (errMat) throw new Error(errMat.message);
      finalMateriaId = nuevaMateria.id;
    }

    // Igual para el tema
    if (!finalTemaId && validatedData.tema_nombre && finalMateriaId) {
      const { data: nuevoTema, error: errTem } = await supabase
        .from("temas")
        .insert({
          user_id: user.id,
          materia_id: finalMateriaId,
          nombre: validatedData.tema_nombre,
        })
        .select("id, nombre")
        .single();
      
      if (errTem) throw new Error(errTem.message);
      finalTemaId = nuevoTema.id;
    }

    // Insertar la sesión
    const { data, error } = await supabase
      .from("sesiones")
      .insert({
        user_id: user.id,
        materia_id: finalMateriaId,
        tema_id: finalTemaId,
        nivel_educativo: validatedData.nivel_educativo,
        contexto: validatedData.contexto,
        metodo_recomendado: validatedData.metodo_recomendado,
        metodo_utilizado: validatedData.metodo_utilizado,
        objetivo: validatedData.objetivo,
        duracion_planificada_minutos: validatedData.duracion_planificada_minutos,
        hora_inicio: new Date().toISOString(),
        estado: 'activa'
      })
      .select("id, estado, materia_id, tema_id, duracion_planificada_minutos, hora_inicio")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
