"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimate, useDragControls, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { fundido, resorteHoja } from "@/lib/movimiento";

interface HojaProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
}

// Umbrales para cerrar al soltar: distancia arrastrada o velocidad del gesto (skill apple-design §5–6)
const CIERRE_DISTANCIA_PX = 96;
const CIERRE_VELOCIDAD_PX_S = 600;

/**
 * Hoja inferior (bottom sheet) sobre <dialog> nativo: foco atrapado, Escape y fondo inerte los da el
 * navegador, igual que en Dialogo. Entra desde abajo y sale por el mismo camino (§7); se cierra
 * arrastrando el asa hacia abajo, con resistencia hacia arriba (§9). Solo el asa y la cabecera
 * inician el arrastre, para no interferir con deslizadores o listas dentro de la hoja.
 * En escritorio se muestra centrada, como un diálogo.
 */
export default function Hoja({ abierto, onCerrar, titulo, descripcion, children }: HojaProps) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const anteriorRef = useRef<HTMLElement | null>(null);
  const [alcance, animar] = useAnimate();
  const controlesArrastre = useDragControls();
  const reducido = useReducedMotion();
  const tituloId = useId();
  const descId = useId();
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Abrir: showModal y entrada desde abajo
  useEffect(() => {
    const d = dialogoRef.current;
    if (!d || !abierto || d.open) return;
    const activo = document.activeElement as HTMLElement | null;
    if (activo && !activo.closest("dialog")) anteriorRef.current = activo;
    d.showModal();
    // El panel arrastrable es enfocable para motion: el foco va al campo marcado o al botón Cerrar
    (d.querySelector<HTMLElement>("[data-autofocus]") ?? d.querySelector<HTMLElement>("[data-cerrar]"))?.focus();
    if (alcance.current) {
      animar(
        alcance.current,
        reducido ? { opacity: [0, 1], y: 0 } : { y: ["100%", "0%"], opacity: 1 },
        reducido ? fundido : resorteHoja
      );
    }
  }, [abierto, montado, animar, alcance, reducido]);

  // Cerrar: sale hacia abajo y luego se cierra el <dialog>
  const cerrarAnimado = async () => {
    const d = dialogoRef.current;
    if (!d?.open) return;
    if (alcance.current) {
      await animar(alcance.current, reducido ? { opacity: 0 } : { y: "100%" }, reducido ? fundido : resorteHoja);
    }
    d.close();
  };

  // Si el padre cierra (abierto = false), también se anima la salida
  useEffect(() => {
    if (!abierto && dialogoRef.current?.open) void cerrarAnimado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  const alCerrar = () => {
    if (abierto) onCerrar();
    const anterior = anteriorRef.current;
    setTimeout(() => {
      if (anterior && document.contains(anterior) && anterior.offsetParent !== null && !document.querySelector("dialog[open]")) {
        anterior.focus();
      }
    }, 0);
  };

  if (!montado) return null;

  return createPortal(
    <dialog
      ref={dialogoRef}
      onClose={alCerrar}
      onCancel={(e) => {
        // Escape: salida animada en lugar del cierre seco del navegador
        e.preventDefault();
        void cerrarAnimado();
      }}
      onClick={(e) => {
        if (e.target === dialogoRef.current) void cerrarAnimado();
      }}
      aria-labelledby={tituloId}
      aria-describedby={descripcion ? descId : undefined}
      className="p-0 bg-transparent w-full max-w-full m-0 mt-auto sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-md max-h-[90dvh] overflow-visible backdrop:bg-black/30 backdrop:backdrop-blur-sm"
    >
      <motion.div
        ref={alcance}
        tabIndex={-1}
        drag="y"
        dragControls={controlesArrastre}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > CIERRE_DISTANCIA_PX || info.velocity.y > CIERRE_VELOCIDAD_PX_S) void cerrarAnimado();
        }}
        className="outline-none bg-white rounded-t-4xl sm:rounded-4xl shadow-apple-lg border border-black/[0.08] max-h-[90dvh] overflow-y-auto overscroll-contain"
        style={{ paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))" }}
      >
        {/* Asa y cabecera: zona de arrastre */}
        <div
          className="touch-none cursor-grab active:cursor-grabbing px-6 pt-3"
          onPointerDown={(e) => controlesArrastre.start(e)}
        >
          <div aria-hidden="true" className="mx-auto h-1.5 w-10 rounded-full bg-black/15" />
          <div className="flex items-start justify-between gap-3 pt-4 pb-4">
            <div className="min-w-0">
              <h2 id={tituloId} className="apple-title-3 text-arctic-slate">{titulo}</h2>
              {descripcion && <p id={descId} className="text-sm text-arctic-secondary mt-0.5">{descripcion}</p>}
            </div>
            <button
              type="button"
              onClick={() => void cerrarAnimado()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Cerrar"
              data-cerrar
              className="w-11 h-11 -mr-2 -mt-1 rounded-full flex items-center justify-center text-arctic-secondary hover:text-arctic-slate hover:bg-black/[0.05] transition-colors shrink-0"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="px-6">{children}</div>
      </motion.div>
    </dialog>,
    document.body
  );
}
