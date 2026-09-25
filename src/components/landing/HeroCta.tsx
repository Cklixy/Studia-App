"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";
import { CTA_CON_SESION, CTA_PRINCIPAL, CTA_SECUNDARIO } from "@/lib/landing";

// Acción principal del hero: una sola, con el mismo texto que en la barra y el CTA final.
export default function HeroCta() {
  const haySesion = useHaySesion();

  if (haySesion) {
    return (
      <Link href="/materias" className="btn-apple-primary text-base min-h-12 px-8 apple-tactile">
        <span>{CTA_CON_SESION}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <>
      <Link href="/registro" className="btn-apple-primary text-base min-h-12 px-8 apple-tactile">
        <span>{CTA_PRINCIPAL}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
      <a href="#como-funciona" className="btn-apple-secondary text-base min-h-12 px-6 apple-tactile">
        {CTA_SECUNDARIO}
      </a>
    </>
  );
}
