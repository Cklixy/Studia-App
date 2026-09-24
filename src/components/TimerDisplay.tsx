"use client";

import { memo } from "react";

interface TimerDisplayProps {
  remainingSeconds: number;
  secondsElapsed: number;
  formatTime: (seconds: number) => string;
}

function TimerDisplayComponent({
  remainingSeconds,
  secondsElapsed,
  formatTime,
}: TimerDisplayProps) {
  return (
    <>
      {/* role="timer": los lectores no lo anuncian cada segundo; se lee al enfocarlo */}
      <span role="timer" aria-label={`Quedan ${formatTime(remainingSeconds)}`} className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-arctic-slate font-sans tabular-nums">
        {formatTime(remainingSeconds)}
      </span>
      <span className="text-xs font-semibold text-arctic-secondary uppercase tracking-widest mt-1">
        tiempo restante
      </span>
      <span className="text-xs text-arctic-secondary mt-2">
        Transcurrido: {formatTime(secondsElapsed)}
      </span>
    </>
  );
}

export const TimerDisplay = memo(TimerDisplayComponent);
