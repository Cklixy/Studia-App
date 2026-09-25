"use client";

import { CloudRain, Waves, Wind, AudioLines, VolumeX } from "lucide-react";
import { AMBIENTES, type AmbienteId } from "@/lib/ambientes";
import { useReproductor } from "./ReproductorProvider";

const ICONOS: Record<AmbienteId, React.ElementType> = {
  lluvia: CloudRain,
  oleaje: Waves,
  "ruido-marron": AudioLines,
  "ruido-rosa": Wind,
};

/**
 * Rejilla de ambientes. Tocar uno lo reproduce al instante (el toque es el gesto que exige el
 * navegador para sonar); «Sin sonido» lo detiene. Cada opción es un botón con aria-pressed.
 */
export default function SelectorAmbientes({ compacto = false }: { compacto?: boolean }) {
  const { ambiente, sonando, reproducir, detener } = useReproductor();
  const silencio = !sonando;

  const clasesOpcion = (activo: boolean) =>
    `flex items-center gap-3 min-h-12 px-3.5 py-2.5 rounded-2xl border text-left apple-tactile transition-colors ${
      activo
        ? "bg-glacier-blue/[0.08] border-glacier-blue/40 text-arctic-slate"
        : "bg-white border-black/[0.08] text-arctic-slate hover:bg-black/[0.03]"
    }`;

  return (
    <div role="group" aria-label="Ambiente de estudio" className={`grid gap-2 ${compacto ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
      <button type="button" aria-pressed={silencio} onClick={detener} className={clasesOpcion(silencio)}>
        <span className="w-8 h-8 rounded-xl bg-black/[0.04] flex items-center justify-center shrink-0">
          <VolumeX size={16} className="text-arctic-secondary" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">Sin sonido</span>
      </button>
      {AMBIENTES.map((a) => {
        const Icono = ICONOS[a.id];
        const activo = sonando && ambiente?.id === a.id;
        return (
          <button
            key={a.id}
            type="button"
            aria-pressed={activo}
            onClick={() => reproducir(a.id)}
            className={clasesOpcion(activo)}
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                activo ? "bg-glacier-blue text-white" : "bg-glacier-blue/10 text-glacier-blue"
              }`}
            >
              <Icono size={16} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight">{a.nombre}</span>
              {!compacto && <span className="block text-xs text-arctic-secondary leading-tight mt-0.5">{a.descripcion}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
