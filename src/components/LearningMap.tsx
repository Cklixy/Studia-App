"use client";

import { CheckCircle2, Circle, Clock, Play, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeChat from "./ThemeChat";

export default function LearningMap({ temas, route }: { temas: any[], route: any }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeChatTema, setActiveChatTema] = useState<any | null>(null);

  // Determinar el tema actual (el primero que no está completado)
  const actualIndex = temas.findIndex(t => t.estado !== 'completado');

  const toggleCompleted = async (tema: any) => {
    setLoadingId(tema.id);
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
      setLoadingId(null);
    }
  };

  const completedCount = temas.filter(t => t.estado === 'completado').length;
  const totalMinutes = temas.reduce((acc, t) => acc + (t.minutos_estimados || 0), 0);
  const completedMinutes = temas.filter(t => t.estado === 'completado').reduce((acc, t) => acc + (t.minutos_estimados || 0), 0);

  return (
    <div className="surface-elevated p-6 md:p-8 rounded-2xl mb-12 border border-white/5">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-sm uppercase tracking-widest font-bold text-electric-periwinkle mb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-periwinkle rounded-full animate-pulse"></div>
            Tu plan de estudio
          </h2>
          <h3 className="text-3xl font-display font-bold text-text-primary">{route?.title || 'Ruta de Aprendizaje'}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-text-secondary font-bold mb-1">Progreso</p>
          <p className="font-mono text-xl font-bold">{completedCount} <span className="text-text-secondary">/ {temas.length}</span></p>
        </div>
      </div>

      <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-8">
        {temas.map((tema, index) => {
          const isCompleted = tema.estado === 'completado';
          const isActual = index === actualIndex;
          const isPending = index > actualIndex && actualIndex !== -1;

          return (
            <div key={tema.id} className={`relative pl-8 md:pl-10 group transition-all duration-300 ${isPending ? 'opacity-50' : ''}`}>
              {/* Nodo */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors border-2 ${
                isCompleted ? 'bg-electric-periwinkle border-electric-periwinkle' :
                isActual ? 'bg-deep-surface border-electric-periwinkle' :
                'bg-deep-surface border-white/20'
              }`}>
                {isCompleted && <CheckCircle2 size={12} className="text-deep-ink" />}
                {isActual && <div className="w-2 h-2 bg-electric-periwinkle rounded-full animate-pulse"></div>}
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`text-xl font-bold ${isCompleted ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                      {tema.nombre}
                    </h4>
                    {tema.dificultad && (
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                        isActual ? 'bg-electric-periwinkle/20 text-electric-periwinkle' : 'bg-white/5 text-text-secondary'
                      }`}>
                        {tema.dificultad}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">{tema.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                    <span className="flex items-center gap-1"><Clock size={12} /> {tema.minutos_estimados || 30} min</span>
                    <button 
                      onClick={() => toggleCompleted(tema)}
                      disabled={loadingId === tema.id}
                      className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
                    >
                      {loadingId === tema.id ? 'Actualizando...' : (isCompleted ? 'Desmarcar' : 'Marcar completado manualmente')}
                    </button>
                  </div>
                </div>

                {isActual && (
                  <div className="flex gap-3 flex-wrap">
                    <Link 
                      href={`/sesion/iniciar/${tema.id}`}
                      className="btn-action shrink-0 flex items-center gap-2 py-2 px-6 shadow-lg shadow-electric-periwinkle/20 animate-in fade-in slide-in-from-right-4 duration-500"
                    >
                      <Play size={16} fill="currentColor" /> Iniciar a estudiar
                    </Link>
                    <button 
                      onClick={() => setActiveChatTema(tema)}
                      className="flex items-center gap-2 border border-electric-periwinkle/30 text-electric-periwinkle px-4 py-2 rounded-lg text-sm hover:bg-electric-periwinkle/10 transition-colors"
                    >
                      <MessageCircle size={14} /> Tengo una duda
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeChatTema && (
        <ThemeChat 
          tema={activeChatTema} 
          materiaNombre={route?.title || "Materia Actual"} 
          onClose={() => setActiveChatTema(null)} 
        />
      )}
    </div>
  );
}
