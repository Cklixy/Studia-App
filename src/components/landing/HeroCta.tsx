"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";

export default function HeroCta() {
  const haySesion = useHaySesion();

  if (haySesion) {
    return (
      <Link
        href="/materias"
        className="btn-primario text-xs sm:text-sm py-3.5 px-8 font-semibold tactil inline-flex items-center justify-center gap-2 shadow-1 rounded-full"
      >
        <span>Ir a mis materias</span>
        <ArrowRight size={15} />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/registro"
        className="btn-primario text-xs sm:text-sm py-3.5 px-8 font-semibold tactil inline-flex items-center justify-center gap-2 shadow-1 rounded-full"
      >
        <span>Empezar gratis</span>
        <ArrowRight size={15} />
      </Link>
      <a
        href="#como-funciona"
        className="btn-secundario text-xs sm:text-sm py-3.5 px-6 font-semibold tactil rounded-full text-center"
      >
        <span>Ver cómo funciona</span>
      </a>
    </>
  );
}
