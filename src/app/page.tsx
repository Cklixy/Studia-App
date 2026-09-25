import LandingNavbar from "@/components/landing/LandingNavbar";
import { Hero, ProblemaSolucion, PlanDeEstudio, SesionEnfoque, ParcialesNotas, Habitos, PreguntasFrecuentes, CtaFinal } from "@/components/landing/Secciones";
import LandingFooter from "@/components/landing/LandingFooter";
import DatosEstructurados from "@/components/landing/DatosEstructurados";
import type { Metadata } from "next";
import { DESCRIPCION_SITIO, NOMBRE_SITIO, TITULO_HOME } from "@/lib/sitio";

// Metadata propia de la home: título con las búsquedas objetivo y canonical.
// openGraph/twitter de una página reemplazan (no combinan) los del layout: se repiten tipo e idioma.
export const metadata: Metadata = {
  title: { absolute: TITULO_HOME },
  description: DESCRIPCION_SITIO,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: NOMBRE_SITIO,
    url: "/",
    title: TITULO_HOME,
    description: DESCRIPCION_SITIO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_HOME,
    description: DESCRIPCION_SITIO,
  },
};

// La landing es estática: no consulta la sesión en el servidor (ver useHaySesion).
// 8 secciones (plan de la landing, fase B): hero, problema → solución, plan de estudio, sesión,
// parciales, hábitos, preguntas frecuentes y CTA final.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-frost-base text-arctic-slate flex flex-col selection:bg-glacier-blue/15 selection:text-glacier-blue relative overflow-x-hidden">
      <DatosEstructurados />

      {/* Luz ambiental sutil */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[350px] bg-gradient-to-b from-glacier-blue/[0.05] via-transparent to-transparent blur-3xl pointer-events-none"
      />

      <LandingNavbar />

      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none space-y-28 sm:space-y-36 pb-20 sm:pb-28">
        <Hero />
        <ProblemaSolucion />
        <PlanDeEstudio />
        <SesionEnfoque />
        <ParcialesNotas />
        <Habitos />
        <PreguntasFrecuentes />
        <CtaFinal />
      </main>

      <LandingFooter />
    </div>
  );
}
