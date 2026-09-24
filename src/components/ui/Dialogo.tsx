"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogoProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  /** Icono decorativo junto al título */
  icono?: React.ReactNode;
  /** Variante visual (borde rojo para acciones destructivas) */
  tono?: "normal" | "peligro";
  anchoMaximo?: "sm" | "md";
  children: React.ReactNode;
}

/**
 * Diálogo modal accesible basado en <dialog> nativo (showModal):
 * foco atrapado, Escape para cerrar y fondo inerte los da el navegador.
 * Se monta en un portal (fuera de tarjetas con backdrop-filter, que rompen position: fixed)
 * y devuelve el foco al elemento que lo abrió.
 */
export default function Dialogo({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  icono,
  tono = "normal",
  anchoMaximo = "md",
  children,
}: DialogoProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const anteriorRef = useRef<HTMLElement | null>(null);
  const tituloId = useId();
  const descId = useId();
  // El portal solo existe en el cliente: se monta tras la hidratación para no generar diferencias
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) {
      // Si se abre desde otro diálogo (p. ej. editar → confirmar), se conserva el disparador original
      const activo = document.activeElement as HTMLElement | null;
      if (activo && !activo.closest("dialog")) anteriorRef.current = activo;
      d.showModal();
      // showModal enfoca el primer control (el botón Cerrar); se prefiere el marcado con data-autofocus
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!abierto && d.open) {
      d.close();
    }
  }, [abierto, montado]);

  // Al cerrarse (Escape, botón o programáticamente) se devuelve el foco
  const alCerrar = () => {
    onCerrar();
    const anterior = anteriorRef.current;
    setTimeout(() => {
      // Solo si sigue en el documento, es visible y no hay otro diálogo abierto que deba tener el foco
      if (anterior && document.contains(anterior) && anterior.offsetParent !== null && !document.querySelector("dialog[open]")) {
        anterior.focus();
      }
    }, 0);
  };

  if (!montado) return null;

  return createPortal(
    <dialog
      ref={ref}
      onClose={alCerrar}
      aria-labelledby={tituloId}
      aria-describedby={descripcion ? descId : undefined}
      // Clic en el fondo (el propio <dialog> fuera de la tarjeta) = cerrar
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className={`p-0 m-auto bg-transparent w-[calc(100%-2rem)] ${anchoMaximo === "sm" ? "max-w-sm" : "max-w-md"} backdrop:bg-black/35 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95 motion-reduce:animate-none`}
    >
      <div className={`bg-white rounded-2xl p-6 shadow-apple-lg border ${tono === "peligro" ? "border-red-500/20" : "border-black/[0.08]"}`}>
        <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            {icono && <div aria-hidden="true" className="shrink-0">{icono}</div>}
            <div className="min-w-0">
              <h2 id={tituloId} className="apple-title-3 text-arctic-slate">{titulo}</h2>
              {descripcion && (
                <p id={descId} className="text-sm text-arctic-secondary mt-0.5">{descripcion}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Cerrar"
            className="w-11 h-11 -mr-2 -mt-2 rounded-full flex items-center justify-center text-arctic-secondary hover:text-arctic-slate hover:bg-black/[0.05] transition-colors shrink-0"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>,
    document.body
  );
}
