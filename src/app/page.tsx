import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroProductMockup from "@/components/landing/HeroProductMockup";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import StudyMapSection from "@/components/landing/StudyMapSection";
import MethodRecommendationSection from "@/components/landing/MethodRecommendationSection";
import FocusSessionSection from "@/components/landing/FocusSessionSection";
import AiTutorSection from "@/components/landing/AiTutorSection";
import ExamsSection from "@/components/landing/ExamsSection";
import ProgressSection from "@/components/landing/ProgressSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-frost-base text-arctic-slate flex flex-col selection:bg-glacier-blue/15 selection:text-glacier-blue relative overflow-x-hidden">
      
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-glacier-blue/[0.05] via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* 1. NAVBAR */}
      <LandingNavbar user={user} />

      {/* CONTENIDO PRINCIPAL (HISTORIA SECUENCIAL) */}
      <main className="flex-1 space-y-16 sm:space-y-24 pb-14 sm:pb-20">
        
        {/* ===================== 2. HERO SECTION ===================== */}
        <section className="relative pt-6 sm:pt-14 md:pt-18 pb-4 sm:pb-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            
            {/* Columna Izquierda: Texto Editorial Grande (5 cols en desktop) */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-black/[0.06] shadow-sm text-xs font-semibold text-arctic-slate">
                <span>✦</span>
                <span>Tu estudio, con dirección</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-arctic-slate leading-[0.98]">
                Estudia <br className="hidden sm:inline lg:hidden xl:inline" />
                con <br className="hidden xl:inline" />
                dirección.
              </h1>

              <p className="text-base sm:text-lg text-arctic-secondary leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
                studia+ organiza tus materias, te ayuda a decidir qué estudiar y recomienda cómo abordar cada tema para que puedas concentrarte en lo que realmente importa.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                {user ? (
                  <Link
                    href="/materias"
                    className="btn-apple-primary text-xs sm:text-sm py-3.5 px-8 font-semibold apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm rounded-full"
                  >
                    <span>Ir a mis materias</span>
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/registro"
                      className="btn-apple-primary text-xs sm:text-sm py-3.5 px-8 font-semibold apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm rounded-full"
                    >
                      <span>Empezar gratis</span>
                      <ArrowRight size={15} />
                    </Link>
                    <a
                      href="#como-funciona"
                      className="btn-apple-secondary text-xs sm:text-sm py-3.5 px-6 font-semibold apple-tactile rounded-full text-center"
                    >
                      <span>Ver cómo funciona</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Columna Derecha: Mockup Grande de Producto Real (7 cols en desktop) */}
            <div className="lg:col-span-7 w-full">
              <HeroProductMockup />
            </div>

          </div>
        </section>

        {/* ===================== 3. PROBLEMA ===================== */}
        <ProblemSection />

        {/* ===================== 4. CÓMO FUNCIONA ===================== */}
        <HowItWorksSection />

        {/* ===================== 5. MAPA DE ESTUDIO ===================== */}
        <StudyMapSection />

        {/* ===================== 6. MÉTODO RECOMENDADO ===================== */}
        <MethodRecommendationSection />

        {/* ===================== 7. SESIÓN DE ENFOQUE ===================== */}
        <FocusSessionSection />

        {/* ===================== 8. TUTOR IA ===================== */}
        <AiTutorSection />

        {/* ===================== 9. PARCIALES ===================== */}
        <ExamsSection />

        {/* ===================== 10. PROGRESO ===================== */}
        <ProgressSection />

        {/* ===================== 11. CTA FINAL ===================== */}
        <FinalCtaSection user={user} />

      </main>

      {/* ===================== 12. FOOTER ===================== */}
      <LandingFooter />

    </div>
  );
}
