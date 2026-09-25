import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HistoryFilters from "@/components/HistoryFilters";
import { BookOpen, Star, Play, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getCachedMaterias } from "@/lib/data/materias";
import { formatHumanDuration, formatNaturalDate, formatMinutesNumber } from "@/lib/format-session";
import { SubjectIconContainer } from "@/lib/subject-icons";
import NavProgreso from "@/components/NavProgreso";

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
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 duration-300">
      <NavProgreso activo="historial" />
      
      {/* 1. HEADER EDITORIAL */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-2 border-b border-linea">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-tinta-3 uppercase tracking-wider block">
            Bitácora de Estudio
          </span>
          <h1 className="titulo-1 text-tinta tracking-tight">
            Historial de Sesiones
          </h1>
          <p className="subtitulo text-xs sm:text-sm text-tinta-2 max-w-xl">
            Consulta los registros detallados de tu enfoque, productividad y métodos empleados.
          </p>
        </div>

        <Link 
          href="/sesion/nueva" 
          className="btn-primario text-xs font-semibold py-2.5 px-5 tactil inline-flex items-center gap-2 self-start sm:self-auto shadow-1 rounded-full"
        >
          <Plus size={15} strokeWidth={2.2} />
          <span>Nueva sesión</span>
        </Link>
      </header>

      {/* Manejo sutil de error si falla la consulta de Supabase */}
      {error && (
        <div className="p-4 rounded-2xl bg-error/[0.06] border border-error/15 text-error flex items-center gap-3 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>No pudimos sincronizar algunas sesiones con el servidor. Intenta recargar la página.</span>
        </div>
      )}

      {/* 2. RESUMEN DE ACTIVIDAD (Franja unificada compacta con separadores sutiles) */}
      <section aria-labelledby="activity-summary-title" className="space-y-2.5">
        <h2 id="activity-summary-title" className="text-xs font-semibold text-tinta-3 uppercase tracking-wider px-1">
          Actividad
        </h2>

        <div className="bg-superficie backdrop-blur-md border border-linea rounded-3xl shadow-2 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-linea overflow-hidden">
          {/* Tiempo Total */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-tinta-2">
              Tiempo total
            </span>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-tinta tabular-nums tracking-tight">
                {formatMinutesNumber(minutosTotales)}
              </span>
              <span className="text-xs font-semibold text-tinta-2 uppercase">
                min
              </span>
            </div>
            <span className="text-xs text-tinta-3">
              {minutosTotales >= 60
                ? `~${(minutosTotales / 60).toFixed(1)} horas de estudio`
                : "Tiempo efectivo de estudio"}
            </span>
          </div>

          {/* Metas Cumplidas */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-tinta-2">
              Metas cumplidas
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-tinta tabular-nums tracking-tight">
                {efectividad}%
              </span>
            </div>
            <span className="text-xs text-tinta-3">
              {exitosas} de {totalSesiones} objetivos logrados
            </span>
          </div>

          {/* Método más Usado */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-1">
            <span className="text-xs font-medium text-tinta-2">
              Método más usado
            </span>
            <div className="my-0.5">
              <span className="text-lg sm:text-xl font-bold text-tinta truncate block tracking-tight">
                {metodoFrecuente}
              </span>
            </div>
            <span className="text-xs text-tinta-3">
              Técnica con mayor constancia
            </span>
          </div>
        </div>
      </section>

      {/* 3. SESIÓN ACTIVA (Prioridad visual destacada con pulso en vivo) */}
      {sesionesActivas && sesionesActivas.length > 0 && (
        <section aria-labelledby="active-session-title" className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 bg-acento rounded-full animate-pulse" />
            <h2 id="active-session-title" className="text-xs uppercase tracking-wider font-semibold text-acento">
              Sesión activa
            </h2>
          </div>

          <div className="space-y-3">
            {sesionesActivas.map((s: any) => {
              const minTranscurridos = Math.max(
                0,
                Math.floor((Date.now() - new Date(s.hora_inicio).getTime()) / 60000)
              );
              const materiaNombre = (s.materias as any)?.nombre;
              const temaNombre = (s.temas as any)?.nombre || s.objetivo || "Sesión libre";

              return (
                <div 
                  key={s.id} 
                  className="rounded-3xl bg-gradient-to-r from-acento/[0.035] via-superficie to-superficie border border-acento/25 p-5 sm:p-6 shadow-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <SubjectIconContainer subjectName={materiaNombre} size="md" className="mt-0.5" />
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-acento bg-acento/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-acento rounded-full animate-ping" />
                          En curso · {minTranscurridos} min
                        </span>
                      </div>
                      
                      <h3 className="titulo-3 text-tinta truncate">
                        {materiaNombre || "Sesión sin materia"}
                      </h3>
                      
                      <p className="subtitulo text-xs sm:text-sm text-tinta-2 truncate">
                        {temaNombre}
                      </p>

                      {s.metodo_utilizado && (
                        <span className="inline-flex items-center gap-1 text-xs text-tinta-3 pt-0.5">
                          <BookOpen size={12} className="text-tinta-3/70" />
                          {s.metodo_utilizado}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/sesion/activa/${s.id}`}
                    className="btn-primario text-xs py-2.5 px-5 font-semibold tactil inline-flex items-center gap-2 shrink-0 shadow-1 rounded-full self-stretch sm:self-auto justify-center"
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
          <h2 id="history-list-title" className="titulo-3 text-tinta font-semibold">
            Sesiones anteriores
          </h2>
          <span className="text-xs font-medium text-tinta-3 tabular-nums">
            {totalSesiones} {totalSesiones === 1 ? "sesión" : "sesiones"}
          </span>
        </div>

        {totalSesiones === 0 ? (
          <div className="bg-superficie backdrop-blur-md border border-linea rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-hundido text-tinta-2 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={22} strokeWidth={1.8} className="text-tinta-3" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-tinta">
              No encontramos sesiones
            </h3>
            <p className="text-xs text-tinta-2 mt-1 max-w-sm mx-auto">
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
                  className="bg-superficie hover:bg-superficie border border-linea hover:border-acento/25 hover:shadow-2 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 transition-all duration-150 hover:-translate-y-[1px]"
                >
                  {/* Icono temático + Datos descriptivos */}
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                    <SubjectIconContainer subjectName={materiaNombre} size="md" className="mt-0.5" />

                    <div className="min-w-0 flex-1">
                      {/* Materia */}
                      <h3 className="text-sm sm:text-[15px] font-semibold text-tinta tracking-tight truncate">
                        {materiaNombre || "Materia eliminada"}
                      </h3>
                      
                      {/* Tema u Objetivo */}
                      <p className="text-xs sm:text-[13px] text-tinta-2 truncate mt-0.5">
                        {temaNombre}
                      </p>

                      {/* Metadatos secundarios: Fecha y Método */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-tinta-3">
                        <span>{fechaTexto}</span>

                        {s.metodo_utilizado && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="inline-flex items-center gap-1 text-tinta-2">
                              <BookOpen size={11} className="text-tinta-3/70" />
                              {s.metodo_utilizado}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tiempo y Productividad */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-linea">
                    <div className="sm:text-right">
                      <span className="text-sm sm:text-base font-bold text-tinta tabular-nums tracking-tight block">
                        {duracionTexto}
                      </span>
                    </div>

                    {s.calificacion_productividad && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-aviso sm:mt-0.5">
                        <Star size={11} className="fill-aviso text-aviso" />
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
