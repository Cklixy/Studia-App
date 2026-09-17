"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Square, Sparkles } from "lucide-react";

export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [pausasCount, setPausasCount] = useState(0);

  const durationSeconds = (session.duracion_planificada_minutos || 25) * 60;
  const remaining = Math.max(0, durationSeconds - secondsElapsed);
  const progressRatio = Math.min(1, secondsElapsed / durationSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, remaining]);

  const togglePause = () => {
    if (isActive) {
      setPausasCount((p) => p + 1);
    }
    setIsActive(!isActive);
  };

  const handleFinish = () => {
    router.push(`/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="apple-card w-full max-w-2xl mx-auto p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden bg-white/95 border border-black/[0.08] shadow-apple-lg">
      
      {/* Ambient Breathing Background Glow en Tonos Fríos */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          isActive 
            ? "bg-glacier-blue/[0.07]" 
            : "bg-cool-amber/[0.08]"
        }`} 
      />

      {/* Header Context */}
      <div className="relative z-10 space-y-1 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-xs font-semibold text-arctic-secondary">
          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-glacier-blue animate-pulse" : "bg-cool-amber"}`} />
          <span>{isActive ? "Modo Concentración Activo" : "Sesión en Pausa"}</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-arctic-slate mt-3">
          {session.materias?.nombre || "Materia de Estudio"}
        </h1>
        <p className="text-base text-arctic-secondary font-medium">
          {session.temas?.nombre || "Sesión General"}
        </p>
      </div>

      {/* Circular Timer Ring en Cristal Blanco */}
      <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 mb-8 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
          {/* Background Track */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            className="stroke-black/[0.05]"
            strokeWidth="10"
            fill="none"
          />
          {/* Animated Progress Arc: Glacier Blue to Polar Cyan */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke={isActive ? "url(#activeTimerGradient)" : "#F59E0B"}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="activeTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0071E3" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Display en Grafito Pizarra */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-6xl md:text-7xl font-bold tracking-tighter text-arctic-slate font-sans tabular-nums">
            {formatTime(remaining)}
          </span>
          <span className="text-xs font-semibold text-arctic-secondary uppercase tracking-widest mt-1">
            tiempo restante
          </span>
          <span className="text-[11px] text-arctic-tertiary mt-2">
            Transcurrido: {formatTime(secondsElapsed)}
          </span>
        </div>
      </div>

      {/* Study Method Capsule */}
      {session.metodo_recomendado && (
        <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/[0.03] border border-black/[0.06] mb-8 text-xs text-arctic-secondary">
          <Sparkles size={14} className="text-cool-iris" />
          <span>Método: <strong className="text-arctic-slate font-medium">{session.metodo_recomendado}</strong></span>
        </div>
      )}

      {/* Control Buttons with Tactile Physics */}
      <div className="relative z-10 flex items-center justify-center gap-4 w-full max-w-sm">
        <button
          onClick={togglePause}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm apple-tactile transition-all shadow-apple-sm ${
            isActive
              ? "bg-cool-amber/10 text-cool-amber border border-cool-amber/25 hover:bg-cool-amber/15"
              : "bg-glacier-blue/10 text-glacier-blue border border-glacier-blue/25 hover:bg-glacier-blue/15"
          }`}
        >
          {isActive ? (
            <>
              <Pause size={18} />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              <span>Reanudar</span>
            </>
          )}
        </button>

        <button
          onClick={handleFinish}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm bg-cool-berry/10 text-cool-berry border border-cool-berry/25 hover:bg-cool-berry/15 apple-tactile transition-all shadow-apple-sm"
        >
          <Square size={16} fill="currentColor" />
          <span>Finalizar</span>
        </button>
      </div>

      {pausasCount > 0 && (
        <p className="relative z-10 text-[11px] text-arctic-tertiary mt-4">
          Pausas realizadas: {pausasCount}
        </p>
      )}
    </div>
  );
}
