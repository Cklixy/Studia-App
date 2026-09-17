import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroPreviewCard from "@/components/landing/HeroPreviewCard";
import BentoFeatures from "@/components/landing/BentoFeatures";
import LandingFooter from "@/components/landing/LandingFooter";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  BrainCircuit, 
  Timer, 
  BarChart3, 
  GraduationCap 
} from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-frost-base text-arctic-slate flex flex-col selection:bg-glacier-blue/15 selection:text-glacier-blue relative overflow-x-hidden">
      
      {/* Top Ambient Glow Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-glacier-blue/[0.07] via-polar-cyan/[0.04] to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <LandingNavbar user={user} />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* ===================== HERO SECTION ===================== */}
        <section className="relative pt-12 sm:pt-20 md:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.08] shadow-apple-sm text-arctic-slate text-xs font-semibold mb-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="w-2 h-2 rounded-full bg-glacier-blue animate-pulse" />
            <span>Impulsado por Gemini 3.6 Flash • Diseñado para la Universidad</span>
          </div>

          {/* Large Title */}
          <h1 className="fluid-h1 font-bold tracking-tight text-arctic-slate max-w-4xl mx-auto leading-[1.12] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            Tu navegación académica inteligente, <br className="hidden sm:inline" />
            diseñada para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-glacier-blue to-polar-cyan">máximo rendimiento</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-arctic-secondary max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
            Estructura rutas de estudio personalizadas, supera parciales difíciles con retroalimentación en tiempo real y construye hábitos de estudio inquebrantables.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-16 sm:mb-20">
            {user ? (
              <Link
                href="/materias"
                className="btn-apple-primary text-sm sm:text-base py-3 sm:py-3.5 px-7 sm:px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-md w-full sm:w-auto justify-center"
              >
                <span>Acceder a mi panel de estudio</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="btn-apple-primary text-sm sm:text-base py-3 sm:py-3.5 px-7 sm:px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-md w-full sm:w-auto justify-center"
                >
                  <span>Comenzar gratis</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#caracteristicas"
                  className="btn-apple-secondary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-7 font-semibold apple-tactile inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span>Ver cómo funciona</span>
                </a>
              </>
            )}
          </div>

          {/* Floating UI Mockup Preview */}
          <HeroPreviewCard />

        </section>

        {/* ===================== STATS STRIP ===================== */}
        <section id="metricas" className="py-12 border-y border-black/[0.06] bg-white/60 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-arctic-slate tabular-nums">
                  3×
                </p>
                <p className="text-xs sm:text-sm text-arctic-secondary font-medium">
                  Mayor retención de conceptos con active recall
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-glacier-blue tabular-nums">
                  +1,400
                </p>
                <p className="text-xs sm:text-sm text-arctic-secondary font-medium">
                  Horas de concentración profunda registradas
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-polar-cyan tabular-nums">
                  94%
                </p>
                <p className="text-xs sm:text-sm text-arctic-secondary font-medium">
                  Tasa de efectividad en parciales clave
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-cool-berry tabular-nums">
                  100%
                </p>
                <p className="text-xs sm:text-sm text-arctic-secondary font-medium">
                  Adaptado al sílabo de tu universidad
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ===================== BENTO FEATURES ===================== */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <BentoFeatures />
        </section>

        {/* ===================== METHODOLOGY SECTION ===================== */}
        <section id="metodologia" className="py-20 bg-gradient-to-b from-transparent via-white/50 to-transparent border-t border-black/[0.04]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue">
                Ciencia del Aprendizaje
              </span>
              <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
                No estudies más horas. Estudia con precisión quirúrgica.
              </h2>
              <p className="text-sm sm:text-base text-arctic-secondary">
                Studia+ integra las técnicas de estudio con mayor evidencia científica en una experiencia de usuario fluida e intuitiva.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              <div className="apple-card p-6 bg-white/95">
                <div className="w-10 h-10 rounded-2xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center mb-4 shadow-apple-sm">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="font-bold text-arctic-slate text-base mb-2">Desglose Curricular</h3>
                <p className="text-xs text-arctic-secondary leading-relaxed">
                  Elimina la parálisis por análisis. El sistema convierte sílabos abrumadores en micro-bloques diarios con metas claras.
                </p>
              </div>

              <div className="apple-card p-6 bg-white/95">
                <div className="w-10 h-10 rounded-2xl bg-polar-cyan/10 text-polar-cyan flex items-center justify-center mb-4 shadow-apple-sm">
                  <Timer size={20} />
                </div>
                <h3 className="font-bold text-arctic-slate text-base mb-2">Enfoque Fricción-Cero</h3>
                <p className="text-xs text-arctic-secondary leading-relaxed">
                  Temporizadores integrados sin elementos distractores para ingresar de inmediato en estado de flujo mental.
                </p>
              </div>

              <div className="apple-card p-6 bg-white/95">
                <div className="w-10 h-10 rounded-2xl bg-cool-berry/10 text-cool-berry flex items-center justify-center mb-4 shadow-apple-sm">
                  <Flame size={20} />
                </div>
                <h3 className="font-bold text-arctic-slate text-base mb-2">Constancia Gamificada</h3>
                <p className="text-xs text-arctic-secondary leading-relaxed">
                  Rachas de fuego, recompensas de XP y niveles de maestría que hacen que volver a estudiar cada día sea adictivo.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ===================== PRE-FOOTER CTA ===================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="apple-card p-8 sm:p-12 md:p-16 bg-gradient-to-br from-white/95 via-white/90 to-frost-base/80 border border-white/90 shadow-apple-lg text-center relative overflow-hidden">
            
            {/* Ambient cold light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-glacier-blue/[0.08] blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glacier-blue/10 text-glacier-blue text-xs font-semibold uppercase tracking-wider">
                <GraduationCap size={15} />
                Comienza Hoy Mismo
              </span>

              <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
                ¿Listo para transformar tu rendimiento académico este semestre?
              </h2>

              <p className="text-sm sm:text-base text-arctic-secondary leading-relaxed">
                Únete a los estudiantes que navegan sus asignaturas con confianza, estructura y la asistencia de IA más avanzada.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={user ? "/materias" : "/registro"}
                  className="btn-apple-primary text-sm sm:text-base py-3 px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-md w-full sm:w-auto justify-center"
                >
                  <span>{user ? "Ir a mis materias" : "Crear mi cuenta gratuita"}</span>
                  <ArrowRight size={17} />
                </Link>
                {!user && (
                  <Link
                    href="/login"
                    className="btn-apple-secondary text-sm sm:text-base py-3 px-6 font-semibold apple-tactile w-full sm:w-auto justify-center"
                  >
                    <span>Ya tengo cuenta</span>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <LandingFooter />

    </div>
  );
}
