"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, BookOpen, CheckSquare, Sparkles } from "lucide-react";

export default function FocusSessionSection() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(1485); // 24:45

  useEffect(() => {
    let interval: any;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <section id="enfoque" className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Modo concentración
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          Cuando sabes qué hacer, estudiar se vuelve más fácil.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Una pantalla limpia, sin pestañas irrelevantes ni distracciones, diseñada para entrar en estado de flujo.
        </p>
      </div>

      {/* Mockup de la Sesión de Enfoque Activa */}
      <div className="max-w-2xl mx-auto">
        <div className="rounded-[28px] bg-white border border-black/[0.08] shadow-[0_25px_60px_-15px_rgba(0,30,80,0.08)] p-6 sm:p-10 space-y-8">
          
          {/* Barra superior de estado */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-glacier-blue animate-pulse" />
              <span className="text-xs font-semibold text-arctic-slate">
                Sesión de Enfoque Activa
              </span>
            </div>

            <span className="text-xs font-medium text-arctic-secondary">
              Bloque 1 de 4
            </span>
          </div>

          {/* Temporizador Central Minimalista */}
          <div className="text-center space-y-3 py-4">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-4 border-glacier-blue/15 relative">
              <div className="absolute inset-2 rounded-full border-2 border-glacier-blue/30 border-dashed" />
              <span className="text-4xl sm:text-5xl font-bold font-mono text-arctic-slate tabular-nums tracking-tight">
                {timerDisplay}
              </span>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold text-glacier-blue uppercase tracking-wider block">
                Cálculo Diferencial
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight">
                Límites algebraicos e indeterminaciones
              </h3>
              <p className="text-xs text-arctic-secondary">
                Técnica Pomodoro · Práctica activa con 5 ejercicios de examen
              </p>
            </div>
          </div>

          {/* Controles de la sesión */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="btn-apple-primary text-xs py-2.5 px-6 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-sm rounded-full"
            >
              {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              <span>{isRunning ? "Pausar bloque" : "Reanudar"}</span>
            </button>

            <button
              onClick={() => setSeconds(1500)}
              className="text-xs font-semibold text-arctic-secondary hover:text-arctic-slate px-4 py-2.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] transition-colors apple-tactile"
            >
              Reiniciar
            </button>
          </div>

          {/* Micro-panel de notas integradas */}
          <div className="p-4 rounded-2xl bg-frost-base/90 border border-black/[0.04] space-y-2 text-left">
            <span className="text-[10px] uppercase font-bold text-arctic-tertiary tracking-wider block">
              Notas de la sesión
            </span>
            <p className="text-xs text-arctic-secondary leading-relaxed">
              • Recordar factorizar diferencia de cuadrados antes de evaluar el límite al infinito. <br />
              • Cuando el denominador da 0, probar multiplicar por el conjugado del numerador.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
