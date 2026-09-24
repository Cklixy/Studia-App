"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";

const ThemeChat = dynamic(() => import("./ThemeChat"), {
  ssr: false,
});

interface LearningMapItemActionsProps {
  tema: {
    id: string;
    nombre: string;
    estado: string;
    descripcion?: string | null;
  };
  materiaNombre: string;
  isActual: boolean;
}

/**
 * Componente cliente aislado para las acciones interactivas de un tema en el LearningMap.
 * Permite que el resto del mapa (layout, cronología, descripciones, estadísticas)
 * sea un Server Component libre de JavaScript en el bundle inicial.
 */
export default function LearningMapItemActions({
  tema,
  materiaNombre,
  isActual,
}: LearningMapItemActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isCompleted = tema.estado === "completado";

  const toggleCompleted = async () => {
    setLoading(true);
    try {
      await fetch(`/api/temas/${tema.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !isCompleted }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar estado del tema:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleCompleted}
        disabled={loading}
        aria-pressed={isCompleted}
        aria-label={isCompleted ? `Desmarcar «${tema.nombre}» como completado` : `Marcar «${tema.nombre}» como completado`}
        className="hover:text-arctic-slate transition-colors underline decoration-black/30 underline-offset-4 text-xs min-h-11 px-1 apple-tactile"
      >
        {loading
          ? "Actualizando..."
          : isCompleted
          ? "Desmarcar"
          : "Marcar completado"}
      </button>

      {isActual && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="btn-apple-secondary text-xs py-2 px-3 apple-tactile inline-flex items-center gap-1.5"
        >
          <MessageCircle size={13} strokeWidth={2} className="text-glacier-blue" />
          <span>Duda rápida</span>
        </button>
      )}

      {isChatOpen && (
        <ThemeChat
          tema={tema}
          materiaNombre={materiaNombre}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
