"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, CheckCircle2, ChevronLeft, Sparkles, Flag } from "lucide-react";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { TimerRing } from "@/components/TimerRing";
import { TimerDisplay } from "@/components/TimerDisplay";
import { avisar } from "@/lib/avisos";

// Modo foco (rediseño 4.3, principio 5): sin dock, el temporizador manda y los controles quedan abajo,
// al alcance del pulgar. «Salir» pausa y guarda (se retoma desde Hoy); cerrar la pestaña con el
// temporizador corriendo pide confirmación, porque el tiempo seguiría contando.
export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();
  // Anuncio para lectores de pantalla: solo cambios de estado, nunca cada segundo
  const [anuncio, setAnuncio] = useState("");

  const alCompletar = useCallback(() => {
    setAnuncio("Sesión completada. Pulsa Guardar sesión para registrar tu progreso.");
    document.title = "✓ Sesión completada · studia+";
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {}
    // Aviso del sistema solo si la persona ya concedió permiso (no se pide aquí)
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      navigator.serviceWorker?.ready
        .then((reg) =>
          reg.showNotification("¡Sesión completada!", {
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

  // Aviso si se interrumpe: cerrar o recargar con el temporizador en marcha
  useEffect(() => {
    if (!isActive || completada) return;
    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [isActive, completada]);

  const alternarPausa = () => {
    setAnuncio(isActive ? "Sesión en pausa." : "Sesión reanudada.");
    togglePause();
  };

  const salir = () => {
    if (isActive && !completada) togglePause();
    avisar("Sesión en pausa. Retómala desde Hoy cuando quieras.", "info");
    router.push("/hoy");
  };

  const terminar = () => {
    limpiarGuardado();
    router.push(`/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`);
  };

  const estado = completada ? "completada" : isActive ? "activa" : "pausa";
  const textoEstado = estado === "completada" ? "Sesión completada" : estado === "activa" ? "Concentrado" : "En pausa";

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-[calc(100dvh-14rem)]">
      <p className="sr-only" aria-live="polite" aria-atomic="true">{anuncio}</p>

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={salir} className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-tinta-2 hover:text-tinta">
          <ChevronLeft aria-hidden="true" size={18} /> Salir
        </button>
        <span className={`chip ${estado === "completada" ? "chip-exito" : estado === "activa" ? "chip-acento" : "chip-aviso"}`}>
          {estado === "completada" ? <CheckCircle2 aria-hidden="true" size={14} /> : <span aria-hidden="true" className={`w-2 h-2 rounded-full ${estado === "activa" ? "bg-acento motion-safe:animate-pulse" : "bg-aviso"}`} />}
          {textoEstado}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        <p className="antetitulo">{session.materias?.nombre || "Sesión de estudio"}</p>
        <h1 className="titulo-2 sm:text-3xl mt-2 max-w-md">{session.temas?.nombre || "Estudio libre"}</h1>
        {session.metodo_recomendado && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-tinta-2">
            <Sparkles aria-hidden="true" size={14} className="text-acento" />
            {session.metodo_recomendado}
          </p>
        )}

        <div className="mt-8">
          <TimerRing durationSeconds={durationSeconds} isActive={isActive} completada={completada} getPreciseElapsedMs={getPreciseElapsedMs}>
            <TimerDisplay remainingSeconds={remainingSeconds} secondsElapsed={secondsElapsed} formatTime={formatTime} completada={completada} />
          </TimerRing>
        </div>

        {session.objetivo && (
          <p className="mt-6 max-w-sm text-tinta-2">
            <Flag aria-hidden="true" size={14} className="inline -mt-0.5 mr-1 text-acento" />
            {session.objetivo}
          </p>
        )}
        {completada && <p className="mt-6 font-semibold text-tinta">¡Buen trabajo! Guarda la sesión para sumar tu XP.</p>}
      </div>

      {/* Controles en la zona del pulgar */}
      <div className="flex flex-col gap-2 pb-2">
        {completada ? (
          <button type="button" onClick={terminar} className="btn-primario text-base min-h-14">
            <CheckCircle2 aria-hidden="true" size={20} /> Guardar sesión
          </button>
        ) : (
          <>
            <button type="button" onClick={alternarPausa} className={`${isActive ? "btn-secundario" : "btn-primario"} text-base min-h-14`}>
              {isActive ? <Pause aria-hidden="true" size={20} /> : <Play aria-hidden="true" size={20} />}
              {isActive ? "Pausar" : "Reanudar"}
            </button>
            <button type="button" onClick={terminar} className="btn-fantasma">
              Terminar ahora y guardar
            </button>
          </>
        )}
        <p className="text-center text-xs text-tinta-2 mt-1">
          {pausasCount > 0 ? `${pausasCount === 1 ? "1 pausa" : `${pausasCount} pausas`} · ` : ""}Tu progreso se guarda aunque cierres la app.
        </p>
      </div>
    </div>
  );
}
