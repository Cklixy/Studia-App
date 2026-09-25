"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";

export default function FinalCtaSection() {
  const user = useHaySesion();
  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full py-4 sm:py-8">
      <div className="rounded-4xl sm:rounded-4xl bg-superficie border border-linea shadow-2 p-6 sm:p-16 md:p-20 text-center space-y-5 sm:space-y-6">
        
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-tinta">
          Tu próximo tema ya puede tener un plan.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-tinta-2 max-w-lg mx-auto leading-relaxed">
          Elige qué estudiar. Descubre cómo hacerlo. Empieza.
        </p>

        <div className="pt-2 sm:pt-3 flex justify-center">
          <Link
            href={user ? "/materias" : "/registro"}
            className="w-full sm:w-auto btn-primario text-xs sm:text-base py-3.5 px-9 font-semibold tactil inline-flex items-center justify-center gap-2.5 shadow-2 rounded-full"
          >
            <span>{user ? "Ir a mis materias" : "Empezar gratis"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
