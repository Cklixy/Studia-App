import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateSessionSchema } from "@/lib/validations/sesiones";
import { z } from "zod";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;
    const body = await request.json();
    const validatedData = updateSessionSchema.parse(body);

    const { data, error } = await supabase
      .from("sesiones")
      .update({
        estado: 'finalizada',
        hora_finalizacion: new Date().toISOString(),
        tiempo_efectivo_segundos: validatedData.tiempo_efectivo_segundos,
        pausas_count: validatedData.pausas_count,
        resultado_logro: validatedData.resultado_logro,
        calificacion_utilidad: validatedData.calificacion_utilidad,
        calificacion_productividad: validatedData.calificacion_productividad,
      })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // --- GAMIFICACIÓN ---
    // 10 XP por cada minuto completo de estudio efectivo
    const gainedXp = Math.floor((validatedData.tiempo_efectivo_segundos || 0) / 60) * 10;
    
    const { data: racha } = await supabase
      .from("rachas")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newDias = 1;
    let newXp = gainedXp;

    if (racha) {
        newXp = (racha.xp_total || 0) + gainedXp;
        if (racha.ultima_actividad) {
            const lastActivity = new Date(racha.ultima_actividad);
            lastActivity.setHours(0, 0, 0, 0);
            
            if (lastActivity.getTime() === yesterday.getTime()) {
                newDias = (racha.dias || 0) + 1; // Mantuvo la racha
            } else if (lastActivity.getTime() === today.getTime()) {
                newDias = racha.dias || 1; // Ya había estudiado hoy
            } else {
                newDias = 1; // Perdió la racha
            }
        }
    }

    // Fórmula simple de nivel: Nivel = trunc( sqrt(XP / 100) ) + 1
    // Nivel 1 = 0 XP, Nivel 2 = 100 XP, Nivel 3 = 400 XP, Nivel 4 = 900 XP...
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

    await supabase
      .from("rachas")
      .upsert({
          user_id: user.id,
          dias: newDias,
          xp_total: newXp,
          nivel_actual: newLevel,
          ultima_actividad: new Date().toISOString()
      }, { onConflict: 'user_id' });

    // --- RECOMPENSAS / INSIGNIAS ---
    // Si la racha ha aumentado, verificar si alcanzó un hito
    if (newDias > (racha?.dias || 0)) {
        const milestones = [3, 7, 14, 30, 50, 100];
        if (milestones.includes(newDias)) {
            // Guardar recompensa en la DB
            await supabase.from("recompensas").insert({
                user_id: user.id,
                descripcion: `¡Racha de ${newDias} días lograda!`,
                desbloqueado: true
            });
        }
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
