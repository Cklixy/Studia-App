import Link from "next/link";
import { Flame } from "lucide-react";
import { plural } from "@/lib/texto";

/**
 * Llama con los días de racha, siempre visible en el encabezado: de color si ya estudiaste hoy,
 * gris si todavía no (el número sigue ahí para que se vea qué se puede perder).
 */
export default function IndicadorRacha({ racha, estudioHoy }: { racha: number; estudioHoy: boolean }) {
  const etiqueta =
    racha === 0
      ? "Sin racha. Estudia hoy para empezarla."
      : `Racha de ${plural(racha, "día", "días")}. ${estudioHoy ? "Ya estudiaste hoy." : "Estudia hoy para mantenerla."}`;

  return (
    <Link
      href="/logros"
      aria-label={etiqueta}
      className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-full hover:bg-black/[0.04] transition-colors apple-tactile"
    >
      <Flame size={20} className={estudioHoy ? "text-cool-berry fill-cool-berry" : "text-arctic-tertiary"} aria-hidden="true" />
      <span className={`text-sm font-bold tabular-nums ${estudioHoy ? "text-cool-berry" : "text-arctic-secondary"}`} aria-hidden="true">
        {racha}
      </span>
    </Link>
  );
}
