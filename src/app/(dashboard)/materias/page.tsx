import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateMateriaForm from "@/components/CreateMateriaForm";
import PushNotificationManager from "@/components/PushNotificationManager";
import StudyTrailWidget from "@/components/StudyTrailWidget";
import StatsPanel from "@/components/StatsPanel";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export default async function MateriasPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Estudiante";

  // Fetch materias and their temas for the Learning Map
  const { data: materias, error } = await supabase
    .from("materias")
    .select(`
      *,
      temas (
        id,
        nombre,
        estado,
        created_at,
        orden,
        dificultad,
        minutos_estimados
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching materias", error);
  }

  // Fetch gamification data
  const { data: rachaData } = await supabase
    .from("rachas")
    .select("dias, xp_total, nivel_actual")
    .eq("user_id", user.id)
    .single();
  const rachaActual = rachaData?.dias || 0;
  const xpTotal = rachaData?.xp_total || 0;
  const nivelActual = rachaData?.nivel_actual || 1;

  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  const { data: sesionesSemana } = await supabase
    .from("sesiones")
    .select("tiempo_efectivo_segundos")
    .eq("user_id", user.id)
    .eq("estado", "finalizada")
    .gte("hora_finalizacion", inicioSemana.toISOString());
  const xpEstaSemana = (sesionesSemana || []).reduce((acc, s) => 
    acc + Math.floor((s.tiempo_efectivo_segundos || 0) / 60) * 10, 0
  );

  // Estadísticas de sesiones (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: sesionesRecientes } = await supabase
    .from("sesiones")
    .select("tiempo_efectivo_segundos, calificacion_productividad, resultado_logro, metodo_utilizado, hora_finalizacion")
    .eq("user_id", user.id)
    .eq("estado", "finalizada")
    .gte("hora_finalizacion", thirtyDaysAgo.toISOString());
  
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
  let nextMove = null;
  if (materias) {
    for (const materia of materias) {
      // Assuming 'pendiente' is the default state
      const pendingTemas = materia.temas?.filter((t: any) => t.estado !== 'completado') || [];
      if (pendingTemas.length > 0) {
        // Sort by creation or priority. Let's just pick the first one for now.
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

  // Placeholder for available time calculation
  const availableTime = "1h 20m"; 

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-700">
      
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-1">Hola, {firstName}</h1>
          <p className="text-text-secondary text-sm">
            {rachaActual > 0 
              ? `Llevas ${rachaActual} días seguidos. ¡Sigue así!`
              : "Comienza tu primera sesión de hoy para iniciar tu racha."}
          </p>
        </div>
      </header>

      {/* Top Row: Core + Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        
        {/* Core (Racha) */}
        <div className="surface-panel relative overflow-hidden flex flex-col items-center justify-center text-center p-8 border-white/5">
          {/* Animated gradient background */}
          <div className="absolute w-[220px] h-[220px] opacity-25 blur-[40px] animate-[spin_14s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, var(--signal-lime), var(--electric-periwinkle), var(--electric-lavender), var(--signal-lime))' }}></div>
          
          <div className="relative w-[118px] h-[118px] rounded-full flex items-center justify-center bg-deep-ink border-2 border-signal-lime/30 z-10 before:content-[''] before:absolute before:-inset-[2px] before:rounded-full before:border-2 before:border-transparent before:border-t-signal-lime before:border-r-signal-lime before:rotate-45">
            <div className="font-display text-4xl font-bold z-10">{rachaActual}</div>
          </div>
          
          <div className="text-sm text-text-secondary mt-4 relative z-10">días de racha</div>
          <div className="text-xs text-text-secondary mt-1.5 relative z-10">
            <b className="text-electric-lavender font-semibold">+{xpEstaSemana} XP</b> esta semana
          </div>
        </div>

        {/* Hero (Next Move) */}
        {nextMove ? (
          <div className="relative overflow-hidden rounded-[20px] border border-white/5 p-8 flex flex-col justify-between bg-gradient-to-br from-deep-elevated to-deep-surface">
            {/* Background blob */}
            <div className="absolute -right-16 -top-16 w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(255,122,102,0.18),transparent_70%)]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-warm-coral uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-warm-coral shadow-[0_0_8px_var(--warm-coral)]"></div>
                ESTUDIA AHORA
              </div>
              <h2 className="font-display text-2xl font-semibold mt-3 mb-2">{nextMove.materia} — {nextMove.tema}</h2>
              <p className="text-sm text-text-secondary max-w-md">Recomendado para hoy. Continúa tu mapa de aprendizaje donde lo dejaste.</p>
            </div>
            
            <div className="flex items-center gap-4 mt-6 relative z-10">
              <Link 
                href={`/sesion/nueva?materia=${nextMove.materiaId}&tema=${nextMove.temaId}`}
                className="btn-action shadow-[0_8px_24px_rgba(200,255,74,0.25)]"
              >
                Iniciar sesión
              </Link>
              <Link href={`/materias/${nextMove.materiaId}`} className="text-sm text-text-secondary hover:text-white transition-colors">
                Cambiar tema →
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[20px] border border-white/5 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-deep-elevated to-deep-surface">
             <div className="text-center relative z-10">
               <p className="text-lg text-text-secondary mb-2">No tienes temas pendientes registrados.</p>
               <p className="text-sm text-text-secondary mb-6">Explora tus materias para añadir un nuevo destino.</p>
               <CreateMateriaForm />
             </div>
          </div>
        )}
      </div>

      {/* Constellation Grid (Materias) */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-lg font-semibold">Tus materias</h3>
          <div className="flex items-center gap-4">
             <Link href="/rutas/crear" className="text-sm text-electric-periwinkle hover:text-white transition-colors hidden md:block">
               ✨ Crear ruta IA
             </Link>
             <CreateMateriaForm />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materias?.map((materia, index) => {
             const temas = materia.temas || [];
             const completedCount = temas.filter((t: any) => t.estado === 'completado').length;
             const progressPct = temas.length > 0 ? Math.round((completedCount / temas.length) * 100) : 0;
             const isGrande = index === 0 && temas.length > 0;

             return (
               <Link 
                 key={materia.id} 
                 href={`/materias/${materia.id}`}
                 className={`surface-panel flex flex-col gap-4 hover:-translate-y-1 hover:border-white/10 transition-all cursor-pointer ${isGrande ? 'md:col-span-2 md:row-span-2 p-7' : 'p-5'}`}
               >
                 <div className="flex justify-between items-start">
                   <div>
                     <div className={`font-semibold ${isGrande ? 'text-[19px] font-display' : 'text-[15px]'}`}>{materia.nombre}</div>
                     <div className="text-xs text-text-secondary mt-1.5">
                       {completedCount} de {temas.length} temas {materia.fecha_parcial ? `· próximo parcial ${new Date(materia.fecha_parcial).toLocaleDateString()}` : ''}
                     </div>
                   </div>
                   {materia.fecha_parcial && (
                     <span className="text-[11px] font-semibold text-warm-coral bg-warm-coral/10 px-2.5 py-1 rounded-md shrink-0">Parcial</span>
                   )}
                 </div>

                 {isGrande ? (
                   <div className="flex-1 min-h-[90px] rounded-xl bg-gradient-to-br from-electric-lavender/15 to-electric-periwinkle/10 flex items-end p-4 border border-white/5 mt-2">
                     <span className="text-xs text-text-secondary">
                        {temas.length > 0 ? 'Mapa de ruta activo' : 'Añade temas para generar ruta'}
                     </span>
                   </div>
                 ) : (
                   <div className="flex-1"></div>
                 )}

                 <div className="flex justify-between items-center text-xs text-text-secondary mt-2">
                   <span>Progreso</span>
                   <b className="text-text-primary font-semibold">{progressPct}%</b>
                 </div>
               </Link>
             );
          })}
          {materias?.length === 0 && (
            <div className="surface-panel p-10 text-center text-text-secondary md:col-span-3">
              Aún no tienes materias registradas en tu sistema de navegación.
            </div>
          )}
        </div>
      </section>

      <StatsPanel 
        totalMinutos={totalMinutos} 
        efectividad={efectividad} 
        totalSesiones={sesionesRecientes?.length || 0} 
        nivelActual={nivelActual} 
        xpTotal={xpTotal} 
      />

      <div className="pt-8">
        <PushNotificationManager />
      </div>
    </div>
  );
}
