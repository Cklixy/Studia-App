"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Pause, Sparkles, CheckCircle2, ChevronLeft } from "lucide-react";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { TimerRing } from "@/components/TimerRing";
import { TimerDisplay } from "@/components/TimerDisplay";
import Hoja from "@/components/ui/Hoja";
import ReproductorMusica from "@/components/musica/ReproductorMusica";
import { emitirEstadoSesion } from "@/lib/ambientes";

export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();
  // Anuncio para lectores de pantalla: solo cambios de estado, nunca cada segundo
  const [anuncio, setAnuncio] = useState("");
  const [confirmarFin, setConfirmarFin] = useState(false);

  const alCompletar = useCallback(() => {
    setAnuncio("Sesión completada. Pulsa Finalizar para registrar tu progreso.");
    document.title = "✓ Sesión completada · studia+";
    emitirEstadoSesion("fin");
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

  // Modo concentración: sin header ni dock mientras esta pantalla está abierta. Restaurar el título al salir.
  useEffect(() => {
    const tituloAnterior = document.title;
    document.body.dataset.enfoque = "";
    return () => {
      delete document.body.dataset.enfoque;
      document.title = tituloAnterior;
    };
  }, []);

  const handleTogglePause = () => {
    setAnuncio(isActive ? "Sesión en pausa." : "Sesión reanudada.");
    emitirEstadoSesion(isActive ? "pausa" : "activa");
    togglePause();
  };

  const handleFinish = () => {
    limpiarGuardado();
    emitirEstadoSesion("fin");
    router.push(`/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`);
  };

  const estado = completada ? "completada" : isActive ? "activa" : "pausa";
  const textoEstado = { completada: "Sesión completada", activa: "Enfocado", pausa: "En pausa" }[estado];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {anuncio}
      </p>

      {/* Barra superior: salir (la sesión sigue corriendo) y estado */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 sm:mb-8">
        <Link
          href="/materias"
          className="btn-apple-ghost text-sm min-h-11 -ml-2 apple-tactile"
          aria-label="Salir del modo concentración. La sesión sigue en curso."
        >
          <ChevronLeft size={18} aria-hidden="true" />
          <span>Salir</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-arctic-secondary">
          {estado === "completada" ? (
            <CheckCircle2 size={14} className="text-emerald-700" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${estado === "activa" ? "bg-glacier-blue" : "bg-black/25"}`} />
          )}
          {textoEstado}
          {pausasCount > 0 && <span className="font-normal">· {pausasCount === 1 ? "1 pausa" : `${pausasCount} pausas`}</span>}
        </span>
      </div>

      {/* Contexto */}
      <div className="space-y-1 mb-6 sm:mb-8 max-w-full">
        <p className="text-xs font-semibold tracking-wide text-arctic-secondary truncate">
          {session.materias?.nombre || "Materia de estudio"}
        </p>
        <h1 className="apple-title-2 text-arctic-slate break-words">{session.temas?.nombre || "Sesión general"}</h1>
      </div>

      {/* Anillo animado a 60 fps con requestAnimationFrame */}
      <TimerRing
        durationSeconds={durationSeconds}
        isActive={isActive}
        completada={completada}
        getPreciseElapsedMs={getPreciseElapsedMs}
      >
        <TimerDisplay
          remainingSeconds={remainingSeconds}
          secondsElapsed={secondsElapsed}
          formatTime={formatTime}
          completada={completada}
        />
      </TimerRing>

      {session.metodo_recomendado && (
        <p className="inline-flex items-center gap-2 text-sm text-arctic-secondary mb-6 max-w-full">
          <Sparkles size={14} strokeWidth={2} className="text-glacier-blue shrink-0" aria-hidden="true" />
          <span className="truncate">
            Método: <strong className="text-arctic-slate font-semibold">{session.metodo_recomendado}</strong>
          </span>
        </p>
      )}

      {/* Sonido opcional: no toca el temporizador */}
      <div className="mb-8">
        <ReproductorMusica />
      </div>

      {/* Controles */}
      {completada ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-arctic-slate">¡Buen trabajo! Registra cómo te fue para sumar tu XP.</p>
          <button type="button" onClick={handleFinish} className="btn-apple-primary min-h-12 px-8 apple-tactile">
            <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
            <span>Finalizar y registrar</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePause}
            aria-label={isActive ? "Pausar sesión" : "Reanudar sesión"}
            className={`w-[72px] h-[72px] rounded-full flex items-center justify-center apple-tactile transition-colors ${
              isActive
                ? "bg-white text-arctic-slate border border-black/[0.08] shadow-apple-md hover:bg-frost-base"
                : "bg-glacier-blue text-white shadow-apple-glow"
            }`}
          >
            {isActive ? (
              <Pause size={26} strokeWidth={2} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play size={26} strokeWidth={2} fill="currentColor" className="ml-1" aria-hidden="true" />
            )}
          </button>
          <button type="button" onClick={() => setConfirmarFin(true)} className="btn-apple-ghost text-sm min-h-11 apple-tactile">
            Terminar sesión
          </button>
        </div>
      )}

      <Hoja
        abierto={confirmarFin}
        onCerrar={() => setConfirmarFin(false)}
        titulo="¿Terminar la sesión ahora?"
        descripcion={`Llevas ${formatTime(secondsElapsed)} de ${formatTime(durationSeconds)}. Se guardará el tiempo que estudiaste.`}
      >
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            data-autofocus
            onClick={() => setConfirmarFin(false)}
            className="btn-apple-primary min-h-12 w-full apple-tactile"
          >
            Seguir estudiando
          </button>
          <button type="button" onClick={handleFinish} className="btn-apple-secondary min-h-12 w-full apple-tactile">
            Terminar y registrar
          </button>
        </div>
      </Hoja>
    </div>
  );
}
