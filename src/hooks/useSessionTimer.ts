"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSessionTimerOptions {
  initialDurationMinutes: number;
  onComplete?: () => void;
}

export interface SessionTimerState {
  isActive: boolean;
  secondsElapsed: number;
  remainingSeconds: number;
  durationSeconds: number;
  pausasCount: number;
  progressRatio: number;
  togglePause: () => void;
  formatTime: (sec: number) => string;
  getPreciseElapsedMs: () => number;
}

/**
 * Hook aislado para gestionar el tiempo de la sesión activa con alta precisión.
 * Utiliza marcas de tiempo (Date.now()) para evitar desfases causados por timers
 * pausados en pestañas secundarias o throttling del navegador.
 */
export function useSessionTimer({
  initialDurationMinutes,
  onComplete,
}: UseSessionTimerOptions): SessionTimerState {
  const durationSeconds = Math.max(1, (initialDurationMinutes || 25) * 60);
  const [isActive, setIsActive] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [pausasCount, setPausasCount] = useState(0);

  const accumulatedMsRef = useRef(0);
  const lastResumeTimeRef = useRef<number | null>(Date.now());
  const isRunningRef = useRef(true);

  // Callback para obtener los milisegundos exactos transcurridos para animación 60fps (requestAnimationFrame)
  const getPreciseElapsedMs = useCallback(() => {
    if (!isRunningRef.current || lastResumeTimeRef.current === null) {
      return accumulatedMsRef.current;
    }
    return accumulatedMsRef.current + (Date.now() - lastResumeTimeRef.current);
  }, []);

  // Tick de 1 segundo para el estado numérico de React
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const currentMs = getPreciseElapsedMs();
      const currentSec = Math.floor(currentMs / 1000);

      setSecondsElapsed(() => {
        if (currentSec >= durationSeconds) {
          setIsActive(false);
          isRunningRef.current = false;
          onComplete?.();
          return durationSeconds;
        }
        return currentSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, durationSeconds, onComplete, getPreciseElapsedMs]);

  const togglePause = useCallback(() => {
    setIsActive((prev) => {
      const next = !prev;
      isRunningRef.current = next;

      if (prev) {
        // Pausar: acumular tiempo transcurrido
        if (lastResumeTimeRef.current !== null) {
          accumulatedMsRef.current += Date.now() - lastResumeTimeRef.current;
        }
        lastResumeTimeRef.current = null;
        setPausasCount((c) => c + 1);
      } else {
        // Reanudar: fijar nuevo punto de partida
        lastResumeTimeRef.current = Date.now();
      }

      return next;
    });
  }, []);

  const formatTime = useCallback((totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const remainingSeconds = Math.max(0, durationSeconds - secondsElapsed);
  const progressRatio = Math.min(1, secondsElapsed / durationSeconds);

  return {
    isActive,
    secondsElapsed,
    remainingSeconds,
    durationSeconds,
    pausasCount,
    progressRatio,
    togglePause,
    formatTime,
    getPreciseElapsedMs,
  };
}
