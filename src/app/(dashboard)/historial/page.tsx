import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import HistoryFilters from "@/components/HistoryFilters";
import { BookOpen, Clock, Target, Star, Play, Timer, Plus } from "lucide-react";
import Link from "next/link";

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

  // Cargar materias para el filtro
  const { data: materias } = await supabase
    .from("materias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  // Construir la query de sesiones finalizadas
  let query = supabase
    .from("sesiones")
    .select(`
      *,
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

  const { data: sesiones, error } = await query;

  // Sesiones activas (en curso)
  const { data: sesionesActivas } = await supabase
    .from("sesiones")
    .select(`
      id, objetivo, duracion_planificada_minutos, hora_inicio, metodo_utilizado,
      materias ( nombre ),
      temas ( nombre )
    `)
    .eq("user_id", user.id)
    .eq("estado", "activa")
    .order("hora_inicio", { ascending: false });

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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Mi Historial</h1>
        <Link href="/sesion/nueva" className="btn-action flex items-center gap-2">
          <Plus size={16} /> Nueva sesión
        </Link>
      </div>

      {/* Sesiones Activas */}
      {sesionesActivas && sesionesActivas.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-lime rounded-full animate-pulse inline-block"></span>
            En curso ahora
          </h2>
          <div className="space-y-3">
            {sesionesActivas.map((s: any) => {
              const minTranscurridos = Math.floor((Date.now() - new Date(s.hora_inicio).getTime()) / 60000);
              return (
                <div key={s.id} className="surface-panel p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-signal-lime">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-signal-lime">Activa</span>
                      <span className="text-xs text-text-secondary">• {minTranscurridos} min transcurridos</span>
                    </div>
                    <h3 className="font-bold text-lg">{(s.materias as any)?.nombre || "Sin materia"}</h3>
                    <p className="text-text-secondary text-sm">{(s.temas as any)?.nombre || s.objetivo || "Sin tema"}</p>
                    <p className="text-xs text-text-secondary mt-1">{s.metodo_utilizado}</p>
                  </div>
                  <Link
                    href={`/sesion/activa/${s.id}`}
                    className="btn-action shrink-0 flex items-center gap-2"
                  >
                    <Play size={14} fill="currentColor" /> Continuar sesión
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <HistoryFilters materias={materias || []} />

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="surface-panel p-6 flex flex-col items-center justify-center text-center gap-3">
          <Clock className="text-electric-periwinkle" size={28} />
          <span className="text-3xl font-display font-bold">{minutosTotales}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Minutos Estudiados</span>
        </div>
        <div className="surface-panel p-6 flex flex-col items-center justify-center text-center gap-3">
          <Target className="text-signal-lime" size={28} />
          <span className="text-3xl font-display font-bold">{efectividad}%</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Efectividad (Metas)</span>
        </div>
        <div className="surface-panel p-6 flex flex-col items-center justify-center text-center gap-3">
          <BookOpen className="text-electric-lavender" size={28} />
          <span className="text-xl font-display font-bold h-9 flex items-center">{metodoFrecuente}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Método Favorito</span>
        </div>
      </div>

      {/* Lista de Sesiones */}
      <h2 className="font-display text-xl font-semibold mb-4">Registro de Sesiones</h2>
      {totalSesiones === 0 ? (
        <div className="surface-panel p-10 text-center text-text-secondary">
          No hay sesiones finalizadas que coincidan con estos filtros.
        </div>
      ) : (
        <div className="space-y-4">
          {sesiones?.map((s) => (
            <div key={s.id} className="surface-panel p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/15 transition-all">
              <div>
                <h3 className="font-bold text-lg">{s.materias?.nombre || "Materia eliminada"}</h3>
                <p className="opacity-70">{s.temas?.nombre || "Tema eliminado"}</p>
                <p className="text-sm opacity-50 mt-1 flex items-center gap-2">
                  {new Date(s.hora_finalizacion).toLocaleDateString()} a las {new Date(s.hora_finalizacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  <span>•</span>
                  {s.metodo_utilizado}
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-xl font-bold">{Math.floor(s.tiempo_efectivo_segundos / 60)} min</span>
                  <span className="text-xs opacity-50 uppercase tracking-wide">Tiempo real</span>
                </div>
                <div className="text-right w-16">
                  <span className="block text-xl font-bold text-yellow-500 flex items-center justify-end gap-1">
                    {s.calificacion_productividad} <Star size={16} fill="currentColor" />
                  </span>
                  <span className="text-xs opacity-50 uppercase tracking-wide">Prod.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
