"use client";

import { useRouter } from "next/navigation";
import { Play, Pause, Square, Sparkles } from "lucide-react";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { TimerRing } from "@/components/TimerRing";
import { TimerDisplay } from "@/components/TimerDisplay";

export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();

  const {
    isActive,
    secondsElapsed,
    remainingSeconds,
    durationSeconds,
    pausasCount,
    togglePause,
    formatTime,
    getPreciseElapsedMs,
  } = useSessionTimer({
    initialDurationMinutes: session.duracion_planificada_minutos || 25,
  });

  const handleFinish = () => {
    router.push(
      `/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`
    );
  };

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

      {/* Circular Timer Ring animado a 60fps con requestAnimationFrame (desacoplado de re-renders de React) */}
      <TimerRing
        durationSeconds={durationSeconds}
        isActive={isActive}
        getPreciseElapsedMs={getPreciseElapsedMs}
      >
        <TimerDisplay
          remainingSeconds={remainingSeconds}
          secondsElapsed={secondsElapsed}
          formatTime={formatTime}
        />
      </TimerRing>

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
