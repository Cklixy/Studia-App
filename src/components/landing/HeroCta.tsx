"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";

// Acción principal de la landing. Con sesión iniciada lleva directamente a «Hoy».
export default function HeroCta({ secundaria = true }: { secundaria?: boolean }) {
  const haySesion = useHaySesion();

  return (
    <>
      <Link href={haySesion ? "/materias" : "/registro"} className="btn-primario text-base min-h-12 px-6">
        <span>{haySesion ? "Ir a mi día" : "Empieza gratis"}</span>
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
      {secundaria && (
        <a href="#como-funciona" className="btn-fantasma text-base min-h-12 px-5">
          Ver cómo funciona
        </a>
      )}
    </>
  );
}
