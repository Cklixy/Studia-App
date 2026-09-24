"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSessionTimerOptions {
  initialDurationMinutes: number;
  /** Id de la sesión: el progreso se guarda en localStorage bajo esta clave */
  sessionId: string;
  onComplete?: () => void;
}

export interface SessionTimerState {
  isActive: boolean;
  completada: boolean;
  secondsElapsed: number;
  remainingSeconds: number;
  durationSeconds: number;
  pausasCount: number;
  progressRatio: number;
  togglePause: () => void;
  formatTime: (sec: number) => string;
  getPreciseElapsedMs: () => number;
  /** Borra el progreso guardado (al finalizar la sesión) */
  limpiarGuardado: () => void;
}

type Guardado = { acumuladoMs: number; reanudadoEn: number | null; pausas: number };

const claveDe = (sessionId: string) => `studia_sesion_${sessionId}`;

function leerGuardado(sessionId: string): Guardado | null {
  try {
    const crudo = localStorage.getItem(claveDe(sessionId));
    return crudo ? (JSON.parse(crudo) as Guardado) : null;
  } catch {
    return null;
  }
}

function escribirGuardado(sessionId: string, g: Guardado) {
  try {
    localStorage.setItem(claveDe(sessionId), JSON.stringify(g));
  } catch {
    // Modo privado o almacenamiento lleno: el temporizador sigue funcionando en memoria
  }
}

/**
 * Temporizador de la sesión activa.
 * Usa marcas de tiempo (Date.now()) para no desfasarse con pestañas en segundo plano, y guarda el
 * progreso en localStorage: antes, recargar o que el móvil descartara la pestaña reiniciaba el
 * reloj a cero y perdía pausas y tiempo estudiado (auditoría U-02).
 */
export function useSessionTimer({
  initialDurationMinutes,
  sessionId,
  onComplete,
}: UseSessionTimerOptions): SessionTimerState {
  const durationSeconds = Math.max(1, (initialDurationMinutes || 25) * 60);
  const durationMs = durationSeconds * 1000;

  const [isActive, setIsActive] = useState(true);
  const [completada, setCompletada] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [pausasCount, setPausasCount] = useState(0);

  const accumulatedMsRef = useRef(0);
  const lastResumeTimeRef = useRef<number | null>(Date.now());
  const isRunningRef = useRef(true);
  const pausasRef = useRef(0);
  const completadoAvisadoRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const getPreciseElapsedMs = useCallback(() => {
    if (!isRunningRef.current || lastResumeTimeRef.current === null) {
      return accumulatedMsRef.current;
    }
    return accumulatedMsRef.current + (Date.now() - lastResumeTimeRef.current);
  }, []);

  const guardar = useCallback(() => {
    escribirGuardado(sessionId, {
      acumuladoMs: accumulatedMsRef.current,
      reanudadoEn: isRunningRef.current ? lastResumeTimeRef.current : null,
      pausas: pausasRef.current,
    });
  }, [sessionId]);

  const completar = useCallback(() => {
    // Congela el tiempo en la duración planificada
    accumulatedMsRef.current = durationMs;
    lastResumeTimeRef.current = null;
    isRunningRef.current = false;
    setIsActive(false);
    setCompletada(true);
    setSecondsElapsed(durationSeconds);
    guardar();
    if (!completadoAvisadoRef.current) {
      completadoAvisadoRef.current = true;
      onCompleteRef.current?.();
    }
  }, [durationMs, durationSeconds, guardar]);

  // Al montar: recuperar el progreso guardado (recarga, pestaña descartada, volver a la app)
  useEffect(() => {
    const g = leerGuardado(sessionId);
    if (g) {
      accumulatedMsRef.current = g.acumuladoMs;
      lastResumeTimeRef.current = g.reanudadoEn;
      isRunningRef.current = g.reanudadoEn !== null;
      pausasRef.current = g.pausas;
      setPausasCount(g.pausas);
      setIsActive(g.reanudadoEn !== null);
    } else {
      guardar();
    }
    const ms = getPreciseElapsedMs();
    if (ms >= durationMs) {
      // Se completó mientras la pestaña estaba cerrada: no se vuelve a avisar
      completadoAvisadoRef.current = true;
      completar();
    } else {
      setSecondsElapsed(Math.floor(ms / 1000));
    }
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Tick de 1 s para el estado numérico de React
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const currentMs = getPreciseElapsedMs();
      if (currentMs >= durationMs) {
        completar();
        return;
      }
      setSecondsElapsed(Math.floor(currentMs / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, durationMs, getPreciseElapsedMs, completar]);

  const togglePause = useCallback(() => {
    if (completada) return;
    if (isRunningRef.current) {
      // Pausar: acumular el tiempo transcurrido
      if (lastResumeTimeRef.current !== null) {
        accumulatedMsRef.current += Date.now() - lastResumeTimeRef.current;
      }
      lastResumeTimeRef.current = null;
      isRunningRef.current = false;
      pausasRef.current += 1;
      setPausasCount(pausasRef.current);
      setIsActive(false);
      setSecondsElapsed(Math.floor(accumulatedMsRef.current / 1000));
    } else {
      // Reanudar: nuevo punto de partida
      lastResumeTimeRef.current = Date.now();
      isRunningRef.current = true;
      setIsActive(true);
    }
    guardar();
  }, [completada, guardar]);

  const limpiarGuardado = useCallback(() => {
    try {
      localStorage.removeItem(claveDe(sessionId));
    } catch {}
  }, [sessionId]);

  const formatTime = useCallback((totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const remainingSeconds = Math.max(0, durationSeconds - secondsElapsed);
  const progressRatio = Math.min(1, secondsElapsed / durationSeconds);

  return {
    isActive,
    completada,
    secondsElapsed,
    remainingSeconds,
    durationSeconds,
    pausasCount,
    progressRatio,
    togglePause,
    formatTime,
    getPreciseElapsedMs,
    limpiarGuardado,
  };
}
