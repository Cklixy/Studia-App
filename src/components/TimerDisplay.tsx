"use client";

import { memo } from "react";

interface TimerDisplayProps {
  remainingSeconds: number;
  secondsElapsed: number;
  formatTime: (seconds: number) => string;
  completada?: boolean;
}

// Cifras grandes y tabulares (no «bailan» cada segundo), legibles a un brazo de distancia.
function TimerDisplayComponent({ remainingSeconds, secondsElapsed, formatTime, completada = false }: TimerDisplayProps) {
  return (
    <>
      {/* role="timer": los lectores no lo anuncian cada segundo; se lee al enfocarlo */}
      <span
        role="timer"
        aria-label={completada ? "Tiempo completado" : `Quedan ${formatTime(remainingSeconds)}`}
        className="text-[4.5rem] sm:text-8xl font-bold leading-none tracking-tight text-tinta tabular-nums"
      >
        {formatTime(remainingSeconds)}
      </span>
      <span className="text-sm font-semibold text-tinta-2 mt-2">
        {completada ? "¡Tiempo completado!" : "restantes"}
      </span>
      <span className="text-xs text-tinta-2 mt-1 tabular-nums">Llevas {formatTime(secondsElapsed)}</span>
    </>
  );
}

export const TimerDisplay = memo(TimerDisplayComponent);
