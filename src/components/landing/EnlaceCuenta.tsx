"use client";

import Link from "next/link";
import { useHaySesion } from "@/hooks/useHaySesion";

// Enlace de la cabecera: «Entrar» sin sesión, «Ir a mi día» con sesión. La acción principal es la del hero.
export default function EnlaceCuenta() {
  const haySesion = useHaySesion();
  return (
    <Link href={haySesion ? "/hoy" : "/login"} className="btn-secundario text-sm px-4">
      {haySesion ? "Ir a mi día" : "Entrar"}
    </Link>
  );
}
