"use client";

import { useEffect, useRef, memo } from "react";

interface TimerRingProps {
  durationSeconds: number;
  isActive: boolean;
  getPreciseElapsedMs: () => number;
  radius?: number;
  children?: React.ReactNode;
}

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Componente memoizado de alto rendimiento para el anillo circular SVG.
 * Actualiza la propiedad strokeDashoffset directamente sobre el DOM utilizando
 * requestAnimationFrame, evitando re-renders del árbol de React en cada frame.
 */
function TimerRingComponent({
  durationSeconds,
  isActive,
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

  return (
    <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-6 sm:mb-8 z-10 max-w-full aspect-square">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280" aria-hidden="true" focusable="false">
        {/* Background Track */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          className="stroke-black/[0.05]"
          strokeWidth="10"
          fill="none"
        />

        {/* Animated Progress Arc animado a 60fps via requestAnimationFrame en el DOM */}
        <circle
          ref={circleRef}
          cx="140"
          cy="140"
          r={radius}
          stroke={isActive ? "url(#activeTimerGradient)" : "#F59E0B"}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="transition-colors duration-300"
        />

        <defs>
          <linearGradient id="activeTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0071E3" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centro del reloj (texto aislado de la animación de cuadro) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        {children}
      </div>
    </div>
  );
}

export const TimerRing = memo(TimerRingComponent);
