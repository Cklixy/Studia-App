"use client";

import { CloudRain, Waves, Wind, AudioLines, VolumeX, Music2 } from "lucide-react";
import { AMBIENTES, type AmbienteId } from "@/lib/ambientes";
import { useReproductor } from "./ReproductorProvider";

const ICONOS: Record<AmbienteId, React.ElementType> = {
  lluvia: CloudRain,
  oleaje: Waves,
  "ruido-marron": AudioLines,
  "ruido-rosa": Wind,
};

/**
 * Elección rápida de sonido antes de empezar (paso 2 de «Nueva sesión»): una fila de fichas.
 * Tocar una la reproduce al instante (el toque es el gesto que exige el navegador); «Sin sonido» la
 * detiene. Spotify se elige dentro de la sesión, donde vive su reproductor.
 */
export default function SelectorAmbientes({ compacto: _compacto }: { compacto?: boolean }) {
  const { fuente, ambiente, sonando, reproducirAmbiente, reproducirLofi, detener } = useReproductor();

  const ficha = (activo: boolean) =>
    `inline-flex items-center gap-2 min-h-11 px-3.5 rounded-full border text-sm font-medium apple-tactile transition-colors ${
      activo ? "bg-glacier-blue text-white border-glacier-blue" : "bg-white text-arctic-slate border-black/[0.08] hover:bg-black/[0.03]"
    }`;

  return (
    <div role="group" aria-label="Sonido de estudio" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!sonando} onClick={detener} className={ficha(!sonando)}>
        <VolumeX size={15} aria-hidden="true" />
        Sin sonido
      </button>
      <button type="button" aria-pressed={sonando && fuente === "lofi"} onClick={() => reproducirLofi()} className={ficha(sonando && fuente === "lofi")}>
        <Music2 size={15} aria-hidden="true" />
        Lo-fi
      </button>
      {AMBIENTES.map((a) => {
        const Icono = ICONOS[a.id];
        const activo = sonando && fuente === "ambiente" && ambiente?.id === a.id;
        return (
          <button key={a.id} type="button" aria-pressed={activo} onClick={() => reproducirAmbiente(a.id)} className={ficha(activo)}>
            <Icono size={15} aria-hidden="true" />
            {a.nombre}
          </button>
        );
      })}
    </div>
  );
}
