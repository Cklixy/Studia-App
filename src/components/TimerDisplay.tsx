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
      <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-arctic-slate font-sans tabular-nums">
        {formatTime(remainingSeconds)}
      </span>
      <span className="text-xs font-semibold text-arctic-secondary uppercase tracking-widest mt-1">
        tiempo restante
      </span>
      <span className="text-[11px] text-arctic-tertiary mt-2">
        Transcurrido: {formatTime(secondsElapsed)}
      </span>
    </>
  );
}

export const TimerDisplay = memo(TimerDisplayComponent);
