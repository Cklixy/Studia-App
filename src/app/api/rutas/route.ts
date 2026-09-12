import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { materia_id, materia_nombre, titulo_ruta, prompt_original, temas } = body;

    if (!temas || !Array.isArray(temas) || temas.length === 0) {
      return NextResponse.json({ error: "Faltan temas en la ruta" }, { status: 400 });
    }

    // 1. Resolver la materia
    let finalMateriaId = materia_id;
    if (!finalMateriaId) {
      if (!materia_nombre) {
        return NextResponse.json({ error: "Se requiere un ID de materia o un nombre" }, { status: 400 });
      }
      
      // Check if it already exists to avoid duplicates
      const { data: existingMateria } = await supabase
        .from('materias')
        .select('id')
        .eq('user_id', user.id)
        .ilike('nombre', materia_nombre)
        .single();
        
      if (existingMateria) {
        finalMateriaId = existingMateria.id;
      } else {
        const { data: newMateria, error: mError } = await supabase
          .from("materias")
          .insert({
            user_id: user.id,
            nombre: materia_nombre,
            descripcion: "Materia generada por IA"
          })
          .select()
          .single();
          
        if (mError) throw mError;
        finalMateriaId = newMateria.id;
      }
    }

    // 2. Crear la Ruta
    const { data: route, error: routeError } = await supabase
      .from("study_routes")
      .insert({
        user_id: user.id,
        materia_id: finalMateriaId,
        title: titulo_ruta,
        prompt_original,
        estado: 'ACTIVE',
        ai_generated: true
      })
      .select()
      .single();

    if (routeError) throw routeError;

    // 3. Insertar los temas secuencialmente para guardar sus IDs y establecer dependencias
    let previousTemaId = null;

    for (let i = 0; i < temas.length; i++) {
      const temaData = temas[i];
      const { data: newTema, error: tError } = await supabase
        .from("temas")
        .insert({
          user_id: user.id,
          materia_id: finalMateriaId,
          route_id: route.id,
          nombre: temaData.nombre,
          descripcion: temaData.descripcion,
          dificultad: temaData.dificultad,
          minutos_estimados: temaData.minutos_estimados,
          orden: i + 1,
          ai_generated: true,
          estado: 'pendiente'
        })
        .select()
        .single();

      if (tError) throw tError;

      // 4. Establecer dependencia lineal simple (cada tema depende del anterior)
      if (previousTemaId) {
        await supabase
          .from("topic_dependencies")
          .insert({
            tema_id: newTema.id,
            depende_de_tema_id: previousTemaId
          });
      }
      previousTemaId = newTema.id;
    }

    return NextResponse.json({ success: true, route_id: route.id, materia_id: finalMateriaId });
  } catch (error: any) {
    console.error("Error al guardar ruta:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al guardar la ruta." },
      { status: 500 }
    );
  }
}
