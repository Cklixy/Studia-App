"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, MessageCircle } from "lucide-react";

const ThemeChat = dynamic(() => import("./ThemeChat"), { ssr: false });

export default function TemaItem({ tema, materiaNombre }: { tema: any; materiaNombre: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);

  const toggleCompleted = async () => {
    setLoading(true);
    try {
      const isCompleted = tema.estado === 'completado';
      await fetch(`/api/temas/${tema.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !isCompleted }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = tema.estado === 'completado';

  return (
    <div className={`apple-card p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all apple-tactile ${
      isCompleted
        ? 'bg-glacier-blue/[0.04] border-glacier-blue/20'
        : 'border-black/[0.06]'
    }`}>
      <div className="min-w-0 flex-1">
        <h4 className={`apple-headline truncate ${isCompleted ? 'line-through text-arctic-secondary' : 'text-arctic-slate'}`}>
          {tema.nombre}
          {isCompleted && <span className="sr-only"> (completado)</span>}
        </h4>
        {tema.tipo_contenido && (
          <span className="text-xs font-semibold text-arctic-secondary bg-black/[0.04] px-2 py-0.5 rounded-full mt-1 inline-block">
            {tema.tipo_contenido}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setChatAbierto(true)}
        aria-haspopup="dialog"
        className="btn-apple-secondary text-xs min-h-11 px-3 apple-tactile inline-flex items-center gap-1.5 shrink-0"
      >
        <MessageCircle size={14} strokeWidth={2} className="text-glacier-blue" aria-hidden="true" />
        <span>Tutor<span className="sr-only"> sobre {tema.nombre}</span></span>
      </button>
      {chatAbierto && (
        <ThemeChat tema={tema} materiaNombre={materiaNombre} onClose={() => setChatAbierto(false)} />
      )}
      <button
        type="button"
        onClick={toggleCompleted}
        disabled={loading}
        aria-pressed={isCompleted}
        aria-label={`Marcar «${tema.nombre}» como completado`}
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors disabled:opacity-50 apple-tactile shrink-0"
      >
        {isCompleted ? (
          <CheckCircle2 size={22} strokeWidth={2} className="text-glacier-blue" aria-hidden="true" />
        ) : (
          <Circle size={22} strokeWidth={2} className="text-arctic-borde hover:text-arctic-secondary" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
