import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateSessionSchema } from "@/lib/validations/sesiones";
import { z } from "zod";
import { calcularNuevaRacha, diasDeLaSemana, fechaLocal, fechasDeActividad, inicioSemanaLocal, nivelDesdeXp, soloFecha, XP_POR_MINUTO } from "@/lib/racha";

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

    // Una sesión solo se puede finalizar una vez: antes, repetir el PATCH volvía a sumar XP.
    const { data: sesionActual } = await supabase
      .from("sesiones")
      .select("estado, hora_inicio")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!sesionActual) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }
    if (sesionActual.estado === "finalizada") {
      return NextResponse.json({ error: "La sesión ya estaba finalizada" }, { status: 409 });
    }

    // El tiempo efectivo no puede superar el tiempo real transcurrido desde el inicio
    const transcurridoSegundos = sesionActual.hora_inicio
      ? Math.max(0, Math.floor((Date.now() - new Date(sesionActual.hora_inicio).getTime()) / 1000))
      : validatedData.tiempo_efectivo_segundos;
    const tiempoEfectivo = Math.min(validatedData.tiempo_efectivo_segundos, transcurridoSegundos);

    const { data, error } = await supabase
      .from("sesiones")
      .update({
        estado: 'finalizada',
        hora_finalizacion: new Date().toISOString(),
        tiempo_efectivo_segundos: tiempoEfectivo,
        pausas_count: validatedData.pausas_count,
        resultado_logro: validatedData.resultado_logro,
        calificacion_utilidad: validatedData.calificacion_utilidad,
        calificacion_productividad: validatedData.calificacion_productividad,
      })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .neq("estado", "finalizada") // evita la doble concesión si llegan dos PATCH a la vez
      .select("id, estado, tiempo_efectivo_segundos, hora_finalizacion, resultado_logro")
      .single();

    if (error || !data) {
      // M7: no exponer error.message interno
      return NextResponse.json({ error: "No se pudo finalizar la sesión" }, { status: error ? 500 : 409 });
    }

    // --- GAMIFICACIÓN ---
    // 10 XP por cada minuto completo de estudio efectivo
    const gainedXp = Math.floor(tiempoEfectivo / 60) * XP_POR_MINUTO;

    const { data: racha } = await supabase
      .from("rachas")
      .select("dias, xp_total, nivel_actual, ultima_actividad")
      .eq("user_id", user.id)
      .single();

    // Día en hora de Colombia (antes: hora del servidor, UTC → el día cambiaba a las 19:00)
    const newDias = calcularNuevaRacha(racha?.ultima_actividad, racha?.dias || 0);
    const newXp = (racha?.xp_total || 0) + gainedXp;
    // Nivel = ⌊√(XP/100)⌋ + 1 → nivel 2 = 100 XP, nivel 3 = 400 XP, nivel 4 = 900 XP…
    const newLevel = nivelDesdeXp(newXp);

    await supabase
      .from("rachas")
      .upsert({
          user_id: user.id,
          dias: newDias,
          xp_total: newXp,
          nivel_actual: newLevel,
          ultima_actividad: fechaLocal()
      }, { onConflict: 'user_id' });

    // --- RECOMPENSAS / INSIGNIAS ---
    // Si la racha ha aumentado, verificar si alcanzó un hito
    const rachaAumento = soloFecha(racha?.ultima_actividad) !== fechaLocal(); // primera sesión del día
    const milestones = [3, 7, 14, 30, 50, 100];
    const hito = rachaAumento && milestones.includes(newDias) ? newDias : null;
    if (newDias > (racha?.dias || 0)) {
        if (milestones.includes(newDias)) {
            // Guardar recompensa en la DB
            await supabase.from("recompensas").insert({
                user_id: user.id,
                descripcion: `¡Racha de ${newDias} días lograda!`,
                desbloqueado: true
            });
        }
    }

    // Datos para la pantalla de celebración (solo si hoy es el primer día que suma a la racha)
    let celebracion = null;
    if (rachaAumento) {
      const { data: semana } = await supabase
        .from("sesiones")
        .select("hora_finalizacion")
        .eq("user_id", user.id)
        .eq("estado", "finalizada")
        .gte("hora_finalizacion", inicioSemanaLocal());
      celebracion = {
        dias: newDias,
        hito,
        semana: diasDeLaSemana(fechasDeActividad((semana || []).map((s) => s.hora_finalizacion))),
      };
    }

    return NextResponse.json({ ...data, celebracion });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
