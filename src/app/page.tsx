import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroInteractiveMockup from "@/components/landing/HeroInteractiveMockup";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import StudyMapSection from "@/components/landing/StudyMapSection";
import FocusSessionSection from "@/components/landing/FocusSessionSection";
import AiAssistanceSection from "@/components/landing/AiAssistanceSection";
import ExamsSection from "@/components/landing/ExamsSection";
import ProgressAndHabitsSection from "@/components/landing/ProgressAndHabitsSection";
import WhyStudiaSection from "@/components/landing/WhyStudiaSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-frost-base text-arctic-slate flex flex-col selection:bg-glacier-blue/15 selection:text-glacier-blue relative overflow-x-hidden">
      
      {/* Luz ambiental sutil y fría en la parte superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-glacier-blue/[0.05] via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* 1. NAVBAR */}
      <LandingNavbar user={user} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 space-y-14 sm:space-y-20 pb-12 sm:pb-16">
        
        {/* ===================== 2. HERO SECTION ===================== */}
        <section className="relative pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Headline Principal Limpio y Firme */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-arctic-tertiary uppercase tracking-widest block">
              Navegación y Enfoque Académico
            </span>

            <h1 className="fluid-h1 font-bold tracking-tight text-arctic-slate leading-[1.08]">
              Estudia con dirección.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-arctic-secondary max-w-2xl mx-auto leading-relaxed font-normal">
              studia+ organiza tus materias, recomienda cómo estudiar cada tema y te acompaña durante cada sesión de enfoque.
            </p>
          </div>

          {/* Action CTAs Principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            {user ? (
              <Link
                href="/materias"
                className="btn-apple-primary text-sm sm:text-base py-3 px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-sm rounded-full w-full sm:w-auto justify-center"
              >
                <span>Ir a mi panel de estudio</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="btn-apple-primary text-sm sm:text-base py-3 px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-sm rounded-full w-full sm:w-auto justify-center"
                >
                  <span>Empezar gratis</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#como-funciona"
                  className="btn-apple-secondary text-sm sm:text-base py-3 px-7 font-semibold apple-tactile rounded-full w-full sm:w-auto justify-center"
                >
                  <span>Ver cómo funciona</span>
                </a>
              </>
            )}
          </div>

          {/* Demostración Visual del Producto en Acción */}
          <div className="pt-6 sm:pt-10">
            <HeroInteractiveMockup />
          </div>

        </section>

        {/* ===================== 3. EL PROBLEMA ===================== */}
        <ProblemSection />

        {/* ===================== 4. CÓMO FUNCIONA ===================== */}
        <HowItWorksSection />

        {/* ===================== 5. MAPA DE ESTUDIO ===================== */}
        <StudyMapSection />

        {/* ===================== 6. SESIÓN DE ENFOQUE ===================== */}
        <FocusSessionSection />

        {/* ===================== 7. IA COMO HERRAMIENTA ===================== */}
        <AiAssistanceSection />

        {/* ===================== 8. PARCIALES ===================== */}
        <ExamsSection />

        {/* ===================== 9. HISTORIAL Y PROGRESO ===================== */}
        <ProgressAndHabitsSection />

        {/* ===================== 10. POR QUÉ STUDIA+ ===================== */}
        <WhyStudiaSection />

        {/* ===================== 11. CTA FINAL ===================== */}
        <FinalCtaSection user={user} />

      </main>

      {/* ===================== 12. FOOTER ===================== */}
      <LandingFooter />

    </div>
  );
}
