"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle } from "lucide-react";

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
    <div className={`flex items-center justify-between p-4 border rounded-md mb-2 ${isCompleted ? 'bg-green-500/10 border-green-500/20' : 'bg-background'}`}>
      <div>
        <h4 className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>{tema.nombre}</h4>
        <span className="text-xs bg-foreground/10 px-2 py-1 rounded-full mt-1 inline-block">{tema.tipo_contenido}</span>
      </div>
      <button 
        onClick={toggleCompleted} 
        disabled={loading}
        className="p-2 hover:bg-foreground/5 rounded-full transition disabled:opacity-50"
      >
        {isCompleted ? <CheckCircle className="text-green-500" /> : <Circle className="opacity-50" />}
      </button>
    </div>
  );
}
