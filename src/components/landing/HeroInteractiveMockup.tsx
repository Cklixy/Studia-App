"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Check, Sparkles, Sigma, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HeroInteractiveMockup() {
  const [step, setStep] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25:00

  // Secuencia de entrada tranquila y pausada
  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 500);
    const t2 = setTimeout(() => setStep(3), 1200);
    const t3 = setTimeout(() => setStep(4), 1900);
    const t4 = setTimeout(() => setStep(5), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Timer si el usuario hace clic en "Iniciar enfoque"
  useEffect(() => {
    let interval: any;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Sombra ambiental muy suave */}
      <div className="absolute -inset-2 bg-gradient-to-b from-glacier-blue/[0.08] to-transparent rounded-[32px] blur-2xl pointer-events-none" />

      {/* Tarjeta de Demostración del Producto Real */}
      <div className="relative bg-white/90 backdrop-blur-2xl border border-black/[0.07] rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,25,60,0.08),0_2px_8px_rgba(0,0,0,0.02)] p-6 sm:p-8 text-left transition-all">
        
        {/* Cabecera de la tarjeta */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-arctic-tertiary uppercase tracking-wider">
              Hoy · Siguiente sesión
            </span>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
            isActive 
              ? "bg-glacier-blue/10 text-glacier-blue" 
              : "bg-black/[0.04] text-arctic-secondary"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-glacier-blue animate-pulse" : "bg-arctic-tertiary"
            }`} />
            {isActive ? "En curso" : "Lista para comenzar"}
          </span>
        </div>

        {/* 1. Materia y Tema */}
        <div className="space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-[14px] bg-blue-500/[0.08] border border-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <Sigma size={20} strokeWidth={2} />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              {/* Paso 1: Materia */}
              <div className={`transition-all duration-500 ${step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                <span className="text-xs font-semibold text-arctic-secondary">
                  Cálculo Diferencial
                </span>
              </div>

              {/* Paso 2: Tema específico */}
              <div className={`transition-all duration-500 delay-100 ${step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                <h3 className="text-lg sm:text-xl font-bold text-arctic-slate tracking-tight truncate">
                  Límites e indeterminaciones 0/0
                </h3>
              </div>
            </div>
          </div>

          {/* Paso 3: Método Recomendado */}
          <div className={`pt-2 transition-all duration-500 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <div className="p-3 rounded-2xl bg-frost-base/90 border border-black/[0.04] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-arctic-tertiary tracking-wider block">
                  Método sugerido
                </span>
                <span className="text-xs font-semibold text-arctic-slate">
                  Técnica Pomodoro + Práctica activa
                </span>
              </div>
              <span className="text-[11px] font-medium text-arctic-secondary bg-white px-2 py-0.5 rounded-md border border-black/[0.04]">
                25 min
              </span>
            </div>
          </div>
        </div>

        {/* Paso 4: Temporizador */}
        <div className={`mt-6 pt-5 border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 ${step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <Clock size={18} strokeWidth={2} />
            </div>
            <div>
              <span className="text-2xl font-bold text-arctic-slate tabular-nums tracking-tight font-mono block">
                {formatTimer(secondsLeft)}
              </span>
              <span className="text-[10px] text-arctic-tertiary uppercase tracking-wider font-semibold">
                Bloque de enfoque
              </span>
            </div>
          </div>

          {/* Paso 5: Botón interactivo de inicio */}
          <div className={`w-full sm:w-auto transition-all duration-500 ${step >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <button
              onClick={toggleSession}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm transition-all ${
                isActive
                  ? "bg-black/[0.06] text-arctic-slate hover:bg-black/[0.1]"
                  : "btn-apple-primary"
              }`}
            >
              {isActive ? (
                <>
                  <Pause size={14} fill="currentColor" />
                  <span>Pausar sesión</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Iniciar enfoque</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer sutil de la card con estado */}
        {isActive && (
          <div className="mt-3 text-center text-[11px] text-glacier-blue font-medium duration-300">
            Enfoque en marcha · Elimina distracciones
          </div>
        )}

      </div>
    </div>
  );
}
