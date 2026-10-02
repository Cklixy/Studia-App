"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { Flame } from "lucide-react";
import TiraSemana from "@/components/inicio/TiraSemana";
import { resorte, fundido } from "@/lib/movimiento";
import type { DiaSemana } from "@/lib/racha";
import { plural } from "@/lib/texto";
import { insigniaDeHito } from "@/lib/insignias";

export interface DatosCelebracion {
  dias: number;
  hito: number | null;
  /** Días que un protector salvó al volver a estudiar (0 si la racha no estaba en riesgo) */
  protegidos?: number;
  semana: DiaSemana[];
}

/**
 * Pantalla al terminar la primera sesión del día: la llama aparece, el número sube de un día al
 * siguiente y la tira de la semana marca hoy. Con movimiento reducido todo aparece ya en su sitio.
 */
export default function CelebracionRacha({ datos, onContinuar }: { datos: DatosCelebracion; onContinuar: () => void }) {
  const reducido = useReducedMotion();
  const insignia = datos.hito ? insigniaDeHito(datos.hito) : null;
  const inicio = Math.max(0, datos.dias - 1);
  const [mostrado, setMostrado] = useState(reducido ? datos.dias : inicio);

  useEffect(() => {
    if (reducido) {
      setMostrado(datos.dias);
      return;
    }
    const control = animate(inicio, datos.dias, {
      type: "spring",
      bounce: 0,
      duration: 0.8,
      delay: 0.5,
      onUpdate: (v) => setMostrado(Math.round(v)),
    });
    return () => control.stop();
  }, [datos.dias, inicio, reducido]);

  return (
    <motion.section
      aria-labelledby="celebracion-titulo"
      initial={{ opacity: 0, y: reducido ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducido ? fundido : resorte}
      className="apple-card p-6 sm:p-10 flex flex-col items-center text-center gap-6"
    >
      <motion.div
        aria-hidden="true"
        initial={{ scale: reducido ? 1 : 0.6 }}
        animate={{ scale: 1 }}
        transition={reducido ? fundido : { type: "spring", bounce: 0.3, duration: 0.6 }}
      >
        <Flame size={72} strokeWidth={1.5} className="text-cool-berry fill-cool-berry" />
      </motion.div>

      <div>
        <p className="text-5xl font-bold tracking-tight text-cool-berry tabular-nums" aria-hidden="true">
          {mostrado}
        </p>
        <h2 id="celebracion-titulo" className="apple-title-2 text-arctic-slate mt-1">
          {datos.protegidos
            ? `Un protector salvó tu racha${datos.protegidos > 1 ? ` (${plural(datos.protegidos, "día", "días")})` : ""}. Vuelve mañana para mantenerla.`
            : datos.dias === 1 ? "¡Empezaste tu racha!" : `${plural(datos.dias, "día", "días")} de racha`}
        </h2>
        <p className="text-sm text-arctic-secondary mt-1">
          {datos.dias === 1
              ? "Vuelve mañana para seguir sumando."
              : "Vuelve mañana para mantenerla."}
        </p>
      </div>

      {insignia && (
        <motion.div
          role="status"
          initial={{ opacity: 0, scale: reducido ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={reducido ? fundido : { ...resorte, delay: 0.9 }}
          className="w-full max-w-sm rounded-2xl border border-glacier-blue/30 bg-glacier-blue/[0.06] p-4 flex items-center gap-3 text-left"
        >
          <span aria-hidden="true" className="w-12 h-12 rounded-2xl bg-glacier-blue text-white shadow-apple-glow flex items-center justify-center shrink-0">
            <insignia.icono size={24} strokeWidth={2} />
          </span>
          <span>
            <span className="block text-xs font-semibold text-glacier-blue">¡Insignia desbloqueada!</span>
            <span className="block text-sm font-semibold text-arctic-slate">{insignia.nombre}</span>
            <span className="block text-xs text-arctic-secondary">{insignia.descripcion}</span>
          </span>
        </motion.div>
      )}

      <div className="w-full max-w-sm">
        <TiraSemana dias={datos.semana} />
      </div>

      <button type="button" onClick={onContinuar} data-autofocus className="btn-apple-primary w-full max-w-sm min-h-12 text-sm apple-tactile">
        Continuar
      </button>
    </motion.section>
  );
}
