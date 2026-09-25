"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";
import { CTA_CON_SESION, CTA_PRINCIPAL } from "@/lib/landing";

export default function FinalCtaSection() {
  const haySesion = useHaySesion();
  return (
    <section aria-labelledby="cta-final-titulo" className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1200px] mx-auto w-full">
      <div className="apple-card rounded-4xl p-8 sm:p-16 text-center shadow-apple-lg">
        <h2 id="cta-final-titulo" className="text-3xl sm:text-5xl font-bold tracking-[-0.035em] leading-[1.08] text-arctic-slate text-balance">
          Tu próximo parcial ya puede tener un plan.
        </h2>
        <p className="text-base sm:text-lg text-arctic-secondary mt-4">Crea tu primera materia en un minuto.</p>
        <div className="mt-8 flex justify-center">
          <Link
            href={haySesion ? "/materias" : "/registro"}
            className="w-full sm:w-auto btn-apple-primary text-base min-h-12 px-9 apple-tactile"
          >
            <span>{haySesion ? CTA_CON_SESION : CTA_PRINCIPAL}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
