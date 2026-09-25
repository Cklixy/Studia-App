import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HistoryFilters from "@/components/HistoryFilters";
import { BookOpen, Star, Play, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getCachedMaterias } from "@/lib/data/materias";
import { formatHumanDuration, formatNaturalDate, formatMinutesNumber } from "@/lib/format-session";
import { SubjectIconContainer } from "@/lib/subject-icons";
import NavProgreso from "@/components/NavProgreso";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: { materia?: string; rango?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Construir la query de sesiones finalizadas aislando estrictamente por user_id
  let query = supabase
    .from("sesiones")
    .select(`
      id,
      tiempo_efectivo_segundos,
      duracion_planificada_minutos,
      hora_finalizacion,
      resultado_logro,
      calificacion_utilidad,
      calificacion_productividad,
      metodo_utilizado,
      objetivo,
      materia_id,
      tema_id,
      materias ( nombre ),
      temas ( nombre )
    `)
    .eq("user_id", user.id)
    .eq("estado", "finalizada")
    .order("hora_finalizacion", { ascending: false });

  if (searchParams.materia) {
    query = query.eq("materia_id", searchParams.materia);
  }

  if (searchParams.rango && searchParams.rango !== "all") {
    const days = searchParams.rango === "7d" ? 7 : 30;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    query = query.gte("hora_finalizacion", dateLimit.toISOString());
  }

  // Ejecución en paralelo optimizada de materias (cacheadas), historial y sesiones activas
  const [
    cachedMaterias,
    { data: sesiones, error },
    { data: sesionesActivas }
  ] = await Promise.all([
    getCachedMaterias(user.id, session?.access_token),
    query,
    supabase
      .from("sesiones")
      .select(`
        id, objetivo, duracion_planificada_minutos, hora_inicio, metodo_utilizado,
        materias ( nombre ),
        temas ( nombre )
      `)
      .eq("user_id", user.id)
      .eq("estado", "activa")
      .order("hora_inicio", { ascending: false })
  ]);

  const materias = (cachedMaterias || [])
    .map((m) => ({ id: m.id, nombre: m.nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  if (error) {
    console.error("Error fetching history", error);
  }

  // Agregaciones y métricas
  const totalSesiones = sesiones?.length || 0;
  let totalSegundos = 0;
  let exitosas = 0;
  const methodCounts: Record<string, number> = {};

  sesiones?.forEach((s) => {
    totalSegundos += s.tiempo_efectivo_segundos || 0;
    
    if (s.resultado_logro === "Si" || s.resultado_logro === "Sí" || s.resultado_logro === "Parcialmente") {
      exitosas++;
    }

    if (s.metodo_utilizado) {
      methodCounts[s.metodo_utilizado] = (methodCounts[s.metodo_utilizado] || 0) + 1;
    }
  });

  const minutosTotales = Math.floor(totalSegundos / 60);
  const efectividad = totalSesiones > 0 ? Math.round((exitosas / totalSesiones) * 100) : 0;
  
  let metodoFrecuente = "Ninguno";
  let maxCount = 0;
  for (const [method, count] of Object.entries(methodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      metodoFrecuente = method;
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
      <NavProgreso activo="historial" />

      <EncabezadoPantalla
        etiqueta="Progreso"
        titulo="Historial de sesiones"
        descripcion="Consulta los registros detallados de tu enfoque, productividad y métodos empleados."
        acciones={
          <Link
            href="/sesion/nueva"
            className="btn-apple-primary text-xs font-semibold py-2.5 px-5 apple-tactile inline-flex items-center gap-2 shadow-apple-sm rounded-full"
          >
            <Plus size={15} strokeWidth={2.2} aria-hidden="true" />
            <span>Nueva sesión</span>
          </Link>
        }
      />

      {/* Manejo sutil de error si falla la consulta de Supabase */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/15 text-rose-700 flex items-center gap-3 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>No pudimos sincronizar algunas sesiones con el servidor. Intenta recargar la página.</span>
        </div>
      )}

      {/* 2. RESUMEN DE ACTIVIDAD (Franja unificada compacta con separadores sutiles) */}
      <section aria-labelledby="activity-summary-title" className="space-y-2.5">
        <h2 id="activity-summary-title" className="tracking-wide text-xs font-semibold text-arctic-tertiary px-1">
          Actividad
        </h2>

        <div className="bg-white/80 backdrop-blur-md border border-black/[0.06] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06] overflow-hidden">
          {/* Tiempo Total */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-arctic-secondary">
              Tiempo total
            </span>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-arctic-slate tabular-nums tracking-tight">
                {formatMinutesNumber(minutosTotales)}
              </span>
              <span className="tracking-wide text-xs font-semibold text-arctic-secondary">
                min
              </span>
            </div>
            <span className="text-xs text-arctic-tertiary">
              {minutosTotales >= 60
                ? `~${(minutosTotales / 60).toFixed(1)} horas de estudio`
                : "Tiempo efectivo de estudio"}
            </span>
          </div>

          {/* Metas Cumplidas */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-arctic-secondary">
              Metas cumplidas
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-arctic-slate tabular-nums tracking-tight">
                {efectividad}%
              </span>
            </div>
            <span className="text-xs text-arctic-tertiary">
              {exitosas} de {totalSesiones} objetivos logrados
            </span>
          </div>

          {/* Método más Usado */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-arctic-secondary">
              Método más usado
            </span>
            <div className="my-0.5">
              <span className="text-lg sm:text-xl font-bold text-arctic-slate truncate block tracking-tight">
                {metodoFrecuente}
              </span>
            </div>
            <span className="text-xs text-arctic-tertiary">
              Técnica con mayor constancia
            </span>
          </div>
        </div>
      </section>

      {/* 3. SESIÓN ACTIVA (Prioridad visual destacada con pulso en vivo) */}
      {sesionesActivas && sesionesActivas.length > 0 && (
        <section aria-labelledby="active-session-title" className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span aria-hidden="true" className="w-2 h-2 bg-glacier-blue rounded-full" />
            <h2 id="active-session-title" className="tracking-wide text-xs font-semibold text-glacier-blue">
              Sesión activa
            </h2>
          </div>

          <div className="space-y-3">
            {sesionesActivas.map((s: any) => {
              const minTranscurridos = Math.max(
                0,
                Math.floor((Date.now() - new Date(s.hora_inicio).getTime()) / 60000)
              );
              // Una sesión que lleva mucho más de lo planificado se abandonó sin finalizar (antes decía
              // «En curso · 736 min»): se muestra como «Sin terminar» con la fecha en que empezó
              const abandonada = minTranscurridos > Math.max((s.duracion_planificada_minutos || 25) * 2, 120);
              const materiaNombre = (s.materias as any)?.nombre;
              const temaNombre = (s.temas as any)?.nombre || s.objetivo || "Sesión libre";

              return (
                <div 
                  key={s.id} 
                  className="rounded-3xl bg-gradient-to-r from-glacier-blue/[0.035] via-white/95 to-white/90 border border-glacier-blue/25 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,113,227,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <SubjectIconContainer subjectName={materiaNombre} size="md" className="mt-0.5" />
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-glacier-blue bg-glacier-blue/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                          <span aria-hidden="true" className="w-1.5 h-1.5 bg-glacier-blue rounded-full" />
                          {abandonada
                            ? `Sin terminar · ${formatNaturalDate(s.hora_inicio)}`
                            : `En curso · ${minTranscurridos} min`}
                        </span>
                      </div>
                      
                      <h3 className="apple-title-3 text-arctic-slate truncate">
                        {materiaNombre || "Sesión sin materia"}
                      </h3>
                      
                      <p className="apple-subhead text-xs sm:text-sm text-arctic-secondary truncate">
                        {temaNombre}
                      </p>

                      {s.metodo_utilizado && (
                        <span className="inline-flex items-center gap-1 text-xs text-arctic-tertiary pt-0.5">
                          <BookOpen size={12} className="text-arctic-tertiary/70" />
                          {s.metodo_utilizado}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/sesion/activa/${s.id}`}
                    className="btn-apple-primary text-xs py-2.5 px-5 font-semibold apple-tactile inline-flex items-center gap-2 shrink-0 shadow-apple-sm rounded-full self-stretch sm:self-auto justify-center"
                  >
                    <Play size={13} fill="currentColor" strokeWidth={0} />
                    <span>Continuar sesión</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. FILTROS NATIVOS (Discretos y accesibles) */}
      <section aria-label="Filtros de historial">
        <HistoryFilters materias={materias || []} />
      </section>

      {/* 5. HISTORIAL DE SESIONES ANTERIORES */}
      <section aria-labelledby="history-list-title" className="space-y-3.5">
        <div className="flex justify-between items-baseline px-1">
          <h2 id="history-list-title" className="apple-title-3 text-arctic-slate font-semibold">
            Sesiones anteriores
          </h2>
          <span className="text-xs font-medium text-arctic-tertiary tabular-nums">
            {totalSesiones} {totalSesiones === 1 ? "sesión" : "sesiones"}
          </span>
        </div>

        {totalSesiones === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-black/[0.05] rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] text-arctic-secondary flex items-center justify-center mx-auto mb-3">
              <BookOpen size={22} strokeWidth={1.8} className="text-arctic-tertiary" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-arctic-slate">
              No encontramos sesiones
            </h3>
            <p className="text-xs text-arctic-secondary mt-1 max-w-sm mx-auto">
              No hay sesiones que coincidan con los filtros seleccionados. Prueba seleccionando otra materia o rango de fechas.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sesiones?.map((s) => {
              const materiaNombre = (s.materias as any)?.nombre;
              const temaNombre = (s.temas as any)?.nombre || s.objetivo || "Sesión de estudio";
              const duracionTexto = formatHumanDuration(s.tiempo_efectivo_segundos || 0);
              const fechaTexto = formatNaturalDate(s.hora_finalizacion);

              return (
                <div 
                  key={s.id} 
                  className="bg-white/80 hover:bg-white border border-black/[0.06] hover:border-glacier-blue/25 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 transition-all duration-150 hover:-translate-y-[1px]"
                >
                  {/* Icono temático + Datos descriptivos */}
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <SubjectIconContainer subjectName={materiaNombre} size="md" className="mt-0.5" />

                    <div className="min-w-0 flex-1">
                      {/* Materia */}
                      <h3 className="text-sm sm:text-[15px] font-semibold text-arctic-slate tracking-tight truncate">
                        {materiaNombre || "Materia eliminada"}
                      </h3>
                      
                      {/* Tema u Objetivo */}
                      <p className="text-xs sm:text-[13px] text-arctic-secondary truncate mt-0.5">
                        {temaNombre}
                      </p>

                      {/* Metadatos secundarios: Fecha y Método */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-arctic-tertiary">
                        <span>{fechaTexto}</span>

                        {s.metodo_utilizado && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="inline-flex items-center gap-1 text-arctic-secondary">
                              <BookOpen size={11} className="text-arctic-tertiary/70" />
                              {s.metodo_utilizado}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tiempo y Productividad */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                    <div className="sm:text-right">
                      <span className="text-sm sm:text-base font-bold text-arctic-slate tabular-nums tracking-tight block">
                        {duracionTexto}
                      </span>
                    </div>

                    {s.calificacion_productividad && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 sm:mt-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-500" />
                        <span className="tabular-nums">{s.calificacion_productividad}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
