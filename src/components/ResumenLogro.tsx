"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Clock, Sparkles, PauseCircle } from "lucide-react";
import { XP_POR_MINUTO } from "@/lib/racha";
import Aparecer from "@/components/ui/Aparecer";

/** Número que sube desde 0 con un resorte (sin animación con movimiento reducido). */
function Contador({ valor, sufijo = "" }: { valor: number; sufijo?: string }) {
  const reducido = useReducedMotion();
  const [mostrado, setMostrado] = useState(reducido ? valor : 0);

  useEffect(() => {
    if (reducido) {
      setMostrado(valor);
      return;
    }
    const control = animate(0, valor, {
      type: "spring",
      bounce: 0,
      duration: 1.2,
      onUpdate: (v) => setMostrado(Math.round(v)),
    });
    return () => control.stop();
  }, [valor, reducido]);

  return (
    <span className="tabular-nums">
      {mostrado}
      {sufijo}
    </span>
  );
}

/**
 * Momento de logro al terminar una sesión (skill apple-design §16, Achievement): lo estudiado y la
 * XP que se sumará al registrar, antes del formulario. La XP real se calcula en el servidor al
 * guardar; aquí se muestra la misma fórmula (10 XP por minuto efectivo).
 */
export default function ResumenLogro({ elapsed, pauses }: { elapsed: number; pauses: number }) {
  const minutos = Math.floor(elapsed / 60);
  const xp = minutos * XP_POR_MINUTO;

  const datos = [
    { icono: Clock, etiqueta: "Tiempo estudiado", valor: minutos, sufijo: " min" },
    { icono: Sparkles, etiqueta: "XP al registrar", valor: xp, sufijo: " XP", destacado: true },
    { icono: PauseCircle, etiqueta: "Pausas", valor: pauses, sufijo: "" },
  ];

  return (
    <Aparecer className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-8">
      {datos.map(({ icono: Icono, etiqueta, valor, sufijo, destacado }) => (
        <div key={etiqueta} className="apple-card p-3 sm:p-4 flex flex-col items-center text-center gap-1.5">
          <Icono size={18} className={destacado ? "text-glacier-blue" : "text-arctic-secondary"} aria-hidden="true" />
          <span className={`text-xl sm:text-2xl font-bold tracking-tight ${destacado ? "text-glacier-blue" : "text-arctic-slate"}`}>
            <Contador valor={valor} sufijo={sufijo} />
          </span>
          <span className="text-xs text-arctic-secondary leading-tight">{etiqueta}</span>
        </div>
      ))}
    </Aparecer>
  );
}
