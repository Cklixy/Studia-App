"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

export default function TemaItem({ tema }: { tema: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <div className={`apple-card p-4 flex items-center justify-between transition-all apple-tactile ${
      isCompleted 
        ? 'bg-glacier-blue/[0.04] border-glacier-blue/20' 
        : 'border-black/[0.06]'
    }`}>
      <div>
        <h4 className={`apple-headline ${isCompleted ? 'line-through text-arctic-tertiary' : 'text-arctic-slate'}`}>
          {tema.nombre}
        </h4>
        {tema.tipo_contenido && (
          <span className="text-[10px] font-semibold text-arctic-secondary bg-black/[0.04] px-2 py-0.5 rounded-full mt-1 inline-block">
            {tema.tipo_contenido}
          </span>
        )}
      </div>
      <button 
        onClick={toggleCompleted} 
        disabled={loading}
        className="p-1.5 rounded-full hover:bg-black/[0.04] transition-colors disabled:opacity-50 apple-tactile"
      >
        {isCompleted ? (
          <CheckCircle2 size={18} strokeWidth={2} className="text-glacier-blue" />
        ) : (
          <Circle size={18} strokeWidth={2} className="text-black/25 hover:text-black/50" />
        )}
      </button>
    </div>
  );
}
