"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock, MessageCircle, Play } from "lucide-react";

const ThemeChat = dynamic(() => import("@/components/ThemeChat"), { ssr: false });

export interface TemaFila {
  id: string;
  nombre: string;
  estado: string;
  descripcion?: string | null;
  dificultad?: string | null;
  minutos_estimados?: number | null;
  tipo_contenido?: string | null;
}

/**
 * Fila de tema común para la ruta IA y los temas propios (antes eran dos componentes con estilos y
 * acciones distintas). Marcar como completado responde al instante (actualización optimista) y se
 * revierte si falla; «Estudiar» abre la nueva sesión en el paso 2 y «Tutor» el panel de IA.
 */
export default function FilaTema({
  tema,
  materiaNombre,
  numero,
  siguiente = false,
}: {
  tema: TemaFila;
  materiaNombre: string;
  /** Posición en la ruta (solo temas de la ruta) */
  numero?: number;
  /** Es el siguiente tema pendiente de la ruta */
  siguiente?: boolean;
}) {
  const router = useRouter();
  const [completado, setCompletado] = useState(tema.estado === "completado");
  const [guardando, setGuardando] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);

  const alternar = async () => {
    const nuevo = !completado;
    setCompletado(nuevo);
    setGuardando(true);
    if (nuevo) {
      try {
        navigator.vibrate?.(10);
      } catch {}
    }
    try {
      const res = await fetch(`/api/temas/${tema.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nuevo }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setCompletado(!nuevo);
    } finally {
      setGuardando(false);
    }
  };

  const detalles = [
    tema.minutos_estimados ? `${tema.minutos_estimados} min` : null,
    tema.dificultad,
    tema.tipo_contenido,
  ].filter(Boolean) as string[];

  return (
    <li className={`flex items-start gap-3 px-4 sm:px-5 py-3.5 ${siguiente ? "bg-glacier-blue/[0.04]" : ""}`}>
      <button
        type="button"
        onClick={alternar}
        disabled={guardando}
        aria-pressed={completado}
        aria-label={completado ? `Desmarcar «${tema.nombre}» como completado` : `Marcar «${tema.nombre}» como completado`}
        className="w-11 h-11 -ml-2 -my-1 flex items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors apple-tactile shrink-0"
      >
        {completado ? (
          <CheckCircle2 size={22} strokeWidth={2} className="text-glacier-blue" aria-hidden="true" />
        ) : (
          <Circle size={22} strokeWidth={2} className="text-arctic-borde" aria-hidden="true" />
        )}
      </button>

      <div className="min-w-0 flex-1 pt-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {numero !== undefined && (
            <span className="text-xs tabular-nums text-arctic-secondary" aria-hidden="true">
              {numero}.
            </span>
          )}
          <h4 className={`apple-headline ${completado ? "line-through text-arctic-secondary" : "text-arctic-slate"}`}>
            {tema.nombre}
            {completado && <span className="sr-only"> (completado)</span>}
          </h4>
          {siguiente && !completado && (
            <span className="text-xs font-semibold tracking-wide text-glacier-blue bg-glacier-blue/10 px-2 py-0.5 rounded-full">
              Siguiente
            </span>
          )}
        </div>
        {tema.descripcion && <p className="text-sm text-arctic-secondary mt-1 max-w-xl">{tema.descripcion}</p>}
        {detalles.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-arctic-secondary mt-1">
            {tema.minutos_estimados ? <Clock size={12} aria-hidden="true" /> : null}
            {detalles.join(" · ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2.5">
          {!completado && (
            <Link
              href={`/sesion/iniciar/${tema.id}`}
              className={`${siguiente ? "btn-apple-primary" : "btn-apple-secondary"} text-xs min-h-11 px-4 apple-tactile`}
            >
              <Play size={13} fill="currentColor" aria-hidden="true" />
              <span>
                Estudiar<span className="sr-only"> «{tema.nombre}»</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setChatAbierto(true)}
            aria-haspopup="dialog"
            className="btn-apple-ghost text-xs min-h-11 px-3 apple-tactile"
          >
            <MessageCircle size={14} className="text-glacier-blue" aria-hidden="true" />
            <span>
              Tutor<span className="sr-only"> sobre {tema.nombre}</span>
            </span>
          </button>
        </div>
      </div>

      {chatAbierto && <ThemeChat tema={tema} materiaNombre={materiaNombre} onClose={() => setChatAbierto(false)} />}
    </li>
  );
}
