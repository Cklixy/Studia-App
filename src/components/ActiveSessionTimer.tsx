"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Square, Sparkles, CheckCircle2 } from "lucide-react";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { TimerRing } from "@/components/TimerRing";
import { TimerDisplay } from "@/components/TimerDisplay";

export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();
  // Anuncio para lectores de pantalla: solo cambios de estado, nunca cada segundo
  const [anuncio, setAnuncio] = useState("");

  const alCompletar = useCallback(() => {
    setAnuncio("Sesión completada. Pulsa Finalizar para registrar tu progreso.");
    document.title = "✓ Sesión completada · studia+";
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {}
    // Aviso del sistema solo si la persona ya concedió permiso (no se pide aquí)
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      navigator.serviceWorker?.ready
        .then((reg) =>
          reg.showNotification("¡Sesión completada! 🎉", {
            body: `${session.temas?.nombre || session.materias?.nombre || "Tu sesión"}: registra cómo te fue.`,
            icon: "/icons/icon-192x192.png",
            data: { url: `/sesion/activa/${session.id}` },
          })
        )
        .catch(() => {});
    }
  }, [session]);

  const {
    isActive,
    completada,
    secondsElapsed,
    remainingSeconds,
    durationSeconds,
    pausasCount,
    togglePause,
    formatTime,
    getPreciseElapsedMs,
    limpiarGuardado,
  } = useSessionTimer({
    initialDurationMinutes: session.duracion_planificada_minutos || 25,
    sessionId: session.id,
    onComplete: alCompletar,
  });

  // Restaurar el título al salir
  useEffect(() => {
    const tituloAnterior = document.title;
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  const handleTogglePause = () => {
    setAnuncio(isActive ? "Sesión en pausa." : "Sesión reanudada.");
    togglePause();
  };

  const handleFinish = () => {
    limpiarGuardado();
    router.push(
      `/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`
    );
  };

  const estado = completada ? "completada" : isActive ? "activa" : "pausa";

  return (
    <div className="tarjeta w-full max-w-2xl mx-auto p-4 sm:p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden shadow-3">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {anuncio}
      </p>

      {/* Resplandor de fondo (decorativo) */}
      <div
        aria-hidden="true"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          estado === "completada" ? "bg-exito/[0.08]" : estado === "activa" ? "bg-acento/[0.07]" : "bg-aviso/[0.08]"
        }`}
      />

      {/* Contexto */}
      <div className="relative z-10 space-y-1 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hundido border border-linea text-xs font-semibold text-tinta">
          {estado === "completada" ? (
            <CheckCircle2 size={14} className="text-exito" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${estado === "activa" ? "bg-acento motion-safe:animate-pulse" : "bg-aviso"}`} />
          )}
          <span>
            {estado === "completada" ? "Sesión completada" : estado === "activa" ? "Modo concentración activo" : "Sesión en pausa"}
          </span>
        </div>
        <h1 className="titulo-2 text-tinta mt-3">
          {session.materias?.nombre || "Materia de estudio"}
        </h1>
        <p className="cuerpo text-tinta-2 font-medium">
          {session.temas?.nombre || "Sesión general"}
        </p>
      </div>

      {/* Anillo animado a 60 fps con requestAnimationFrame */}
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

      {session.metodo_recomendado && (
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-hundido border border-linea mb-8 text-sm text-tinta-2">
          <Sparkles size={14} strokeWidth={2} className="text-acento" aria-hidden="true" />
          <span>Método: <strong className="text-tinta font-medium">{session.metodo_recomendado}</strong></span>
        </div>
      )}

      {estado === "completada" && (
        <p className="relative z-10 text-sm text-tinta mb-4">
          ¡Buen trabajo! Pulsa <strong>Finalizar</strong> para guardar tu sesión y sumar XP.
        </p>
      )}

      {/* Controles */}
      <div className="relative z-10 flex items-center justify-center gap-4 w-full max-w-sm">
        {!completada && (
          <button
            type="button"
            onClick={handleTogglePause}
            className={`flex-1 flex items-center justify-center gap-2 min-h-11 py-3 px-6 rounded-full font-semibold text-sm tactil transition-all shadow-1 ${
              isActive
                ? "bg-aviso/10 text-aviso border border-aviso/30 hover:bg-aviso/15"
                : "btn-primario"
            }`}
          >
            {isActive ? (
              <>
                <Pause size={16} strokeWidth={2} aria-hidden="true" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play size={16} strokeWidth={2} aria-hidden="true" />
                <span>Reanudar</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={handleFinish}
          className={`flex-1 min-h-11 text-sm py-3 px-6 tactil shadow-1 ${completada ? "btn-primario" : "btn-peligro"}`}
        >
          {completada ? <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" /> : <Square size={14} strokeWidth={2} aria-hidden="true" />}
          <span>Finalizar</span>
        </button>
      </div>

      {pausasCount > 0 && (
        <p className="relative z-10 text-xs text-tinta-2 mt-4">
          Pausas realizadas: {pausasCount}
        </p>
      )}
    </div>
  );
}
