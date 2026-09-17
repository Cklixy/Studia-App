import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HistoryFilters from "@/components/HistoryFilters";
import { BookOpen, Clock, Target, Star, Play, Plus } from "lucide-react";
import Link from "next/link";
import { getCachedMaterias } from "@/lib/data/materias";

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

  // Construir la query de sesiones finalizadas
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

  // Ejecución en paralelo optimizada de filtros (cacheados), historial y sesiones activas
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

  // Agregaciones
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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <span className="text-[11px] font-semibold text-arctic-tertiary uppercase tracking-wider">
            Bitácora de Estudio
          </span>
          <h1 className="apple-large-title text-arctic-slate mt-0.5">
            Historial de Sesiones
          </h1>
          <p className="apple-body text-xs text-arctic-secondary mt-1">
            Consulta los registros detallados de tu enfoque, productividad y métodos empleados.
          </p>
        </div>

        <Link 
          href="/sesion/nueva" 
          className="btn-apple-primary text-xs py-2.5 px-5 apple-tactile inline-flex items-center gap-2 self-start sm:self-auto shadow-apple-sm"
        >
          <Plus size={15} strokeWidth={2} />
          <span>Nueva sesión</span>
        </Link>
      </div>

      {/* Sesiones Activas en curso */}
      {sesionesActivas && sesionesActivas.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-glacier-blue rounded-full animate-pulse" />
            <h2 className="text-xs uppercase tracking-wider font-semibold text-glacier-blue">
              Sesión activa ahora
            </h2>
          </div>

          <div className="space-y-3">
            {sesionesActivas.map((s: any) => {
              const minTranscurridos = Math.floor((Date.now() - new Date(s.hora_inicio).getTime()) / 60000);
              return (
                <div 
                  key={s.id} 
                  className="apple-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-glacier-blue/30 shadow-apple-sm"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-glacier-blue bg-glacier-blue/10 px-2 py-0.5 rounded-full">
                        En curso
                      </span>
                      <span className="text-xs text-arctic-secondary">
                        {minTranscurridos} minutos transcurridos
                      </span>
                    </div>
                    <h3 className="apple-title-3 text-arctic-slate">{(s.materias as any)?.nombre || "Sin materia"}</h3>
                    <p className="apple-subhead text-xs text-arctic-secondary">{(s.temas as any)?.nombre || s.objetivo || "Sesión libre"}</p>
                    {s.metodo_utilizado && (
                      <span className="inline-block text-[11px] text-arctic-tertiary mt-1">
                        Método: {s.metodo_utilizado}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/sesion/activa/${s.id}`}
                    className="btn-apple-primary text-xs py-2 px-5 font-semibold apple-tactile flex items-center gap-2 shrink-0 shadow-apple-sm"
                  >
                    <Play size={13} strokeWidth={2} />
                    <span>Continuar sesión</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Filtros */}
      <HistoryFilters materias={materias || []} />

      {/* Métricas estilo Apple Health en Cristal Blanco */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-arctic-secondary font-medium">Minutos Totales</span>
            <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <Clock size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-arctic-slate tabular-nums">{minutosTotales}</span>
            <span className="text-xs text-arctic-secondary">min</span>
          </div>
          <div className="text-[11px] text-arctic-tertiary mt-1">
            Tiempo efectivo de estudio
          </div>
        </div>

        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-arctic-secondary font-medium">Efectividad de Metas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Target size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-arctic-slate tabular-nums">{efectividad}%</span>
          </div>
          <div className="text-[11px] text-arctic-tertiary mt-1">
            {exitosas} de {totalSesiones} metas cumplidas
          </div>
        </div>

        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-arctic-secondary font-medium">Método más Utilizado</span>
            <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <BookOpen size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="apple-headline text-arctic-slate truncate">
            {metodoFrecuente}
          </div>
          <div className="text-[11px] text-arctic-tertiary mt-1">
            Técnica con mayor constancia
          </div>
        </div>
      </div>

      {/* Lista de sesiones */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="apple-title-3">
            Sesiones registradas ({totalSesiones})
          </h2>
        </div>

        {totalSesiones === 0 ? (
          <div className="apple-card p-10 text-center text-arctic-secondary">
            <BookOpen size={28} strokeWidth={2} className="mx-auto mb-2 text-arctic-tertiary" />
            <p className="text-sm font-medium">No hay sesiones que coincidan con estos filtros.</p>
            <p className="text-xs text-arctic-tertiary mt-1">Prueba seleccionando otro rango o materia.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sesiones?.map((s) => {
              const minutosReales = Math.floor((s.tiempo_efectivo_segundos || 0) / 60);
              const fecha = new Date(s.hora_finalizacion);
              const fechaStr = fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
              const horaStr = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

              return (
                <div 
                  key={s.id} 
                  className="apple-card p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-all apple-tactile"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-arctic-slate tracking-tight truncate">
                        {(s.materias as any)?.nombre || "Materia eliminada"}
                      </span>
                      <span className="text-[11px] text-arctic-tertiary">•</span>
                      <span className="text-[11px] text-arctic-secondary">{fechaStr} a las {horaStr}</span>
                    </div>
                    
                    <p className="text-xs text-arctic-secondary truncate">
                      {(s.temas as any)?.nombre || s.objetivo || "Sesión de estudio"}
                    </p>

                    {s.metodo_utilizado && (
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/[0.04] text-arctic-tertiary">
                        {s.metodo_utilizado}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-5 shrink-0 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="block text-base font-bold text-arctic-slate tabular-nums">
                        {minutosReales} min
                      </span>
                      <span className="text-[10px] text-arctic-tertiary uppercase tracking-wider">
                        tiempo real
                      </span>
                    </div>

                    {s.calificacion_productividad && (
                      <div className="text-right pl-3 border-l border-black/[0.06]">
                        <span className="flex items-center justify-end gap-1 text-sm font-bold text-amber-500 tabular-nums">
                          <Star size={12} fill="currentColor" />
                          <span>{s.calificacion_productividad}/5</span>
                        </span>
                        <span className="text-[10px] text-arctic-tertiary uppercase tracking-wider">
                          productividad
                        </span>
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
