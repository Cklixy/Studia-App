import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import CreateMateriaForm from "@/components/CreateMateriaForm";
import StatsPanel from "@/components/StatsPanel";
import StudyTrailWidget from "@/components/StudyTrailWidget";
import Link from "next/link";
import { getCachedMaterias } from "@/lib/data/materias";
import { 
  Flame, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  CheckCircle2 
} from "lucide-react";

// Client component diferido únicamente para Web Push API
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), {
  ssr: false,
});

export default async function MateriasPage() {
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

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Estudiante";

  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Consultas en paralelo optimizadas con caché para materias
  const [
    materias,
    { data: rachaData },
    { data: sesionesSemana },
    { data: sesionesRecientes }
  ] = await Promise.all([
    getCachedMaterias(user.id, session?.access_token),

    supabase
      .from("rachas")
      .select("dias, xp_total, nivel_actual")
      .eq("user_id", user.id)
      .single(),

    supabase
      .from("sesiones")
      .select("tiempo_efectivo_segundos")
      .eq("user_id", user.id)
      .eq("estado", "finalizada")
      .gte("hora_finalizacion", inicioSemana.toISOString()),

    supabase
      .from("sesiones")
      .select("tiempo_efectivo_segundos, calificacion_productividad, resultado_logro, metodo_utilizado, hora_finalizacion")
      .eq("user_id", user.id)
      .eq("estado", "finalizada")
      .gte("hora_finalizacion", thirtyDaysAgo.toISOString())
  ]);

  const rachaActual = rachaData?.dias || 0;
  const xpTotal = rachaData?.xp_total || 0;
  const nivelActual = rachaData?.nivel_actual || 1;

  const xpEstaSemana = (sesionesSemana || []).reduce((acc, s) => 
    acc + Math.floor((s.tiempo_efectivo_segundos || 0) / 60) * 10, 0
  );
  
  // Calcular métricas
  const totalMinutos = Math.floor(
    (sesionesRecientes || []).reduce((acc, s) => acc + (s.tiempo_efectivo_segundos || 0), 0) / 60
  );
  const sesionesExitosas = (sesionesRecientes || []).filter(s => 
    s.resultado_logro === "Sí" || s.resultado_logro === "Si" || s.resultado_logro === "Parcialmente"
  ).length;
  const efectividad = sesionesRecientes?.length 
    ? Math.round((sesionesExitosas / sesionesRecientes.length) * 100) 
    : 0;

  // Pre-sort temas for each materia
  if (materias) {
    materias.forEach(m => {
      if (m.temas) {
        m.temas.sort((a: any, b: any) => {
          if (a.orden !== null && b.orden !== null) return a.orden - b.orden;
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      }
    });
  }

  // Calculate Next Move (The first pending theme across all subjects)
  let nextMove: { materia: string; materiaId: string; tema: string; temaId: string } | null = null;
  if (materias) {
    for (const materia of materias) {
      const pendingTemas = materia.temas?.filter((t: any) => t.estado !== 'completado') || [];
      if (pendingTemas.length > 0) {
        pendingTemas.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        nextMove = {
          materia: materia.nombre,
          materiaId: materia.id,
          tema: pendingTemas[0].nombre,
          temaId: pendingTemas[0].id
        };
        break;
      }
    }
  }

  // Today formatted in Spanish
  const fechaHoy = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-9 w-full animate-in fade-in duration-500">
      
      {/* Apple Large Title Header en Grafito Pizarra */}
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-1">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-arctic-secondary capitalize">
            {fechaHoy}
          </span>
          <h1 className="apple-large-title text-arctic-slate mt-1">
            Hola, {firstName}
          </h1>
          <p className="text-arctic-secondary text-sm mt-1">
            {rachaActual > 0 
              ? `Llevas ${rachaActual} días seguidos de enfoque académico. ¡Excelente constancia!`
              : "Comienza una sesión hoy para activar tu racha de estudio."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/rutas" 
            className="btn-apple-secondary text-xs font-semibold py-2 px-4 apple-tactile inline-flex items-center gap-2"
          >
            <Sparkles size={14} className="text-glacier-blue" />
            <span>Crear ruta IA</span>
          </Link>
          <CreateMateriaForm />
        </div>
      </header>

      {/* Top Row: Apple Activity Gauge + Hero Focus Card en Vidrio Blanco */}
      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] lg:grid-cols-[290px_1fr] gap-4 sm:gap-5">
        
        {/* Apple Activity Gauge Card (Racha & XP) */}
        <div className="apple-card p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group">
          <div className="w-full flex items-center justify-between text-xs text-arctic-secondary">
            <span className="font-medium tracking-tight">Racha de Estudio</span>
            <span className="flex items-center gap-1 text-cool-berry font-semibold">
              <Flame size={14} className="fill-cool-berry text-cool-berry" />
              {rachaActual}d
            </span>
          </div>

          {/* Activity Ring Dial en Tonos Fríos */}
          <div className="relative w-36 h-36 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Outer light track */}
              <circle
                cx="60"
                cy="60"
                r="48"
                className="stroke-black/[0.06]"
                strokeWidth="9"
                fill="none"
              />
              {/* Outer Activity Progress: Glacier to Polar Cyan */}
              <circle
                cx="60"
                cy="60"
                r="48"
                stroke="url(#glacierGradient)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - Math.min(1, rachaActual / 7))}`}
                className="transition-all duration-1000 ease-out"
              />
              {/* Inner light track for XP */}
              <circle
                cx="60"
                cy="60"
                r="36"
                className="stroke-black/[0.04]"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="36"
                stroke="url(#irisGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(1, (xpEstaSemana % 500) / 500))}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="glacierGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0071E3" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
                <linearGradient id="irisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Metric Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-arctic-slate tabular-nums">
                {rachaActual}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-arctic-secondary">
                días
              </span>
            </div>
          </div>

          {/* Bottom XP Chip */}
          <div className="w-full pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs">
            <span className="text-arctic-secondary">Esta semana:</span>
            <span className="font-semibold text-glacier-blue">+{xpEstaSemana} XP</span>
          </div>
        </div>

        {/* Hero Next Move Focus Card en Vidrio Blanco */}
        {nextMove ? (
          <div className="apple-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient cold light splash */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-glacier-blue/[0.05] blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glacier-blue/10 border border-glacier-blue/20 text-glacier-blue text-[11px] font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-glacier-blue animate-pulse" />
                Siguiente Paso Recomendado
              </div>

              <div className="mt-4">
                <span className="apple-caption text-arctic-secondary">
                  {nextMove.materia}
                </span>
                <h2 className="apple-title-2 text-arctic-slate mt-1">
                  {nextMove.tema}
                </h2>
                <p className="apple-body text-arctic-secondary max-w-lg mt-2">
                  Tu plan curricular indica que este es el tema prioritario para consolidar hoy.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-black/[0.04]">
              <Link 
                href={`/sesion/nueva?materia=${nextMove.materiaId}&tema=${nextMove.temaId}`}
                className="btn-apple-primary text-xs py-2.5 px-6 font-semibold apple-tactile shadow-apple-sm"
              >
                <span>Comenzar sesión ahora</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href={`/materias/${nextMove.materiaId}`} 
                className="btn-apple-secondary text-xs py-2.5 px-4 apple-tactile"
              >
                <span>Explorar temario</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="apple-card p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-arctic-secondary mb-3">
              <BookOpen size={22} />
            </div>
            <h3 className="text-lg font-semibold text-arctic-slate tracking-tight">Sin temas pendientes</h3>
            <p className="text-sm text-arctic-secondary max-w-sm mt-1 mb-5">
              Has completado tus temas actuales o aún no registras asignaturas en tu plan.
            </p>
            <CreateMateriaForm />
          </div>
        )}
      </div>

      {/* Constellation Grid: Tus Materias */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-arctic-slate">Tus Materias</h3>
            <p className="text-xs text-arctic-secondary">Estructura tus asignaturas y monitorea el avance de cada una</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {materias?.map((materia) => {
            const temas = materia.temas || [];
            const completedCount = temas.filter((t: any) => t.estado === 'completado').length;
            const progressPct = temas.length > 0 ? Math.round((completedCount / temas.length) * 100) : 0;

            return (
              <Link 
                key={materia.id} 
                href={`/materias/${materia.id}`}
                className="apple-card p-5 flex flex-col justify-between group apple-tactile cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-base font-semibold text-arctic-slate tracking-tight group-hover:text-glacier-blue transition-colors">
                      {materia.nombre}
                    </h4>
                    {materia.fecha_parcial && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cool-berry bg-cool-berry/10 border border-cool-berry/20 px-2 py-0.5 rounded-full shrink-0">
                        <Calendar size={11} />
                        <span>{new Date(materia.fecha_parcial).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-arctic-secondary">
                    {completedCount} de {temas.length} temas dominados
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 pt-3 border-t border-black/[0.05]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-arctic-secondary text-[11px]">Progreso</span>
                    <span className="font-semibold text-arctic-slate tabular-nums text-xs">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-black/[0.05] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-glacier-blue transition-all duration-700 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}

          {materias?.length === 0 && (
            <div className="apple-card p-10 text-center text-arctic-secondary md:col-span-3 flex flex-col items-center">
              <BookOpen size={32} className="text-arctic-tertiary mb-3" />
              <p className="text-sm font-medium text-arctic-slate">Aún no tienes materias registradas.</p>
              <p className="text-xs text-arctic-secondary mt-1 mb-4">Crea tu primera materia para comenzar a organizar tus temas.</p>
              <CreateMateriaForm />
            </div>
          )}
        </div>
      </section>

      {/* Gráficos de racha (Server Component puro sin cliente JS) */}
      <StudyTrailWidget dias={rachaActual} />

      {/* Stats Summary Panel */}
      <StatsPanel 
        totalMinutos={totalMinutos} 
        efectividad={efectividad} 
        totalSesiones={sesionesRecientes?.length || 0} 
        nivelActual={nivelActual} 
        xpTotal={xpTotal} 
      />

      {/* Push Notifications Settings */}
      <div className="pt-2">
        <PushNotificationManager />
      </div>
    </div>
  );
}
