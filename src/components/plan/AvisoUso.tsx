"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { fechaReinicio, type EstadoPlan, type TipoUso } from "@/lib/plan";

const NOMBRES: Record<TipoUso, { plural: string; singular: string }> = {
  ruta: { plural: "rutas con IA", singular: "ruta con IA" },
  mensaje: { plural: "mensajes al tutor", singular: "mensaje al tutor" },
};

/** Cuánto queda del mes, en una línea discreta. Al 80 % o más, el texto lo destaca. */
export function ContadorUso({ estado, tipo, className = "" }: { estado: EstadoPlan | null; tipo: TipoUso; className?: string }) {
  if (!estado) return null;
  const { usados, limite } = tipo === "ruta" ? estado.rutas : estado.mensajes;
  const quedan = Math.max(0, limite - usados);
  const nombre = quedan === 1 ? NOMBRES[tipo].singular : NOMBRES[tipo].plural;
  const cerca = quedan > 0 && usados / limite >= 0.8;
  return (
    <p className={`text-xs ${cerca ? "text-amber-700 font-medium" : "text-arctic-secondary"} ${className}`} aria-live="polite">
      {quedan === 0
        ? `Usaste tus ${limite} ${NOMBRES[tipo].plural} de este mes`
        : `Te ${quedan === 1 ? "queda" : "quedan"} ${quedan} ${nombre} este mes${estado.plan === "pro" ? " · Pro" : ""}`}
    </p>
  );
}

/**
 * Aviso al llegar al tope: cuándo se reinicia y, en Free, qué da el Pro. Se muestra en el lugar del
 * formulario (Crear ruta) o del campo del tutor, nunca como un error.
 */
export function AvisoLimite({ estado, tipo }: { estado: Pick<EstadoPlan, "plan" | "reinicia_el">; tipo: TipoUso }) {
  const nombre = NOMBRES[tipo].plural;
  const esPro = estado.plan === "pro";
  return (
    <div role="status" className="rounded-2xl border border-glacier-blue/20 bg-glacier-blue/[0.05] p-4">
      <p className="text-sm font-semibold text-arctic-slate">Usaste tus {nombre} de este mes</p>
      <p className="text-sm text-arctic-secondary mt-1">
        Se reinician el {fechaReinicio(estado.reinicia_el)}.
        {!esPro && ` Con Pro tienes ${tipo === "ruta" ? "50 rutas con IA" : "100 mensajes al tutor"} al mes.`}
      </p>
      {!esPro && (
        <Link href="/planes" className="btn-apple-primary text-sm min-h-11 px-5 mt-3 apple-tactile">
          <Sparkles size={15} aria-hidden="true" />
          <span>Ver el plan Pro</span>
        </Link>
      )}
    </div>
  );
}
