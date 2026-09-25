"use client";

import { useEffect, useRef, memo } from "react";

interface TimerRingProps {
  durationSeconds: number;
  isActive: boolean;
  completada?: boolean;
  getPreciseElapsedMs: () => number;
  radius?: number;
  children?: React.ReactNode;
}

const RADIUS = 120;

/**
 * Componente memoizado de alto rendimiento para el anillo circular SVG.
 * Actualiza la propiedad strokeDashoffset directamente sobre el DOM utilizando
 * requestAnimationFrame, evitando re-renders del árbol de React en cada frame.
 * Un solo azul: en pausa el arco se atenúa en lugar de cambiar de color (antes azul / ámbar / verde).
 */
function TimerRingComponent({
  durationSeconds,
  isActive,
  completada = false,
  getPreciseElapsedMs,
  radius = RADIUS,
  children,
}: TimerRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (circleRef.current) {
        const elapsedMs = getPreciseElapsedMs();
        const ratio = Math.min(1, Math.max(0, elapsedMs / (durationSeconds * 1000)));
        const offset = circumference * (1 - ratio);
        circleRef.current.style.strokeDashoffset = `${offset}px`;
      }

      if (isActive) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    // Ejecutar el primer tick inmediatamente para posicionar el offset
    tick();

    if (isActive) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, durationSeconds, getPreciseElapsedMs, circumference]);

  const enPausa = !isActive && !completada;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6 sm:mb-8 max-w-full aspect-square">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280" aria-hidden="true" focusable="false">
        {/* Pista */}
        <circle cx="140" cy="140" r={radius} className="stroke-black/[0.06]" strokeWidth="12" fill="none" />

        {/* Arco de progreso animado a 60 fps vía requestAnimationFrame en el DOM */}
        <circle
          ref={circleRef}
          cx="140"
          cy="140"
          r={radius}
          stroke="#0066CC"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ opacity: enPausa ? 0.35 : 1, transition: "opacity 300ms ease" }}
        />
      </svg>

      {/* Centro del reloj (texto aislado de la animación de cuadro) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">{children}</div>
    </div>
  );
}

export const TimerRing = memo(TimerRingComponent);
