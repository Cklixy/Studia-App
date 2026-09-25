"use client";

import { memo } from "react";

interface TimerDisplayProps {
  remainingSeconds: number;
  secondsElapsed: number;
  formatTime: (seconds: number) => string;
  completada?: boolean;
}

function TimerDisplayComponent({
  remainingSeconds,
  secondsElapsed,
  formatTime,
  completada = false,
}: TimerDisplayProps) {
  if (completada) {
    return (
      <>
        <span className="text-4xl sm:text-5xl font-bold tracking-tighter text-arctic-slate">¡Listo!</span>
        <span className="text-sm text-arctic-secondary mt-2 tabular-nums">Estudiaste {formatTime(secondsElapsed)}</span>
      </>
    );
  }

  return (
    <>
      {/* role="timer": los lectores no lo anuncian cada segundo; se lee al enfocarlo */}
      <span
        role="timer"
        aria-label={`Quedan ${formatTime(remainingSeconds)}`}
        className="text-6xl sm:text-7xl font-medium tracking-[-0.04em] leading-none text-arctic-slate font-sans tabular-nums"
      >
        {formatTime(remainingSeconds)}
      </span>
      <span className="text-sm text-arctic-secondary mt-2 tabular-nums">Llevas {formatTime(secondsElapsed)}</span>
    </>
  );
}

export const TimerDisplay = memo(TimerDisplayComponent);
