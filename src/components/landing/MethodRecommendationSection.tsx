"use client";

import { useState } from "react";
import { ArrowDown, Check, Clock, Sparkles, Play } from "lucide-react";
import Link from "next/link";

export default function MethodRecommendationSection() {
  const [context, setContext] = useState<"poco_tiempo" | "desde_cero" | "examen">("poco_tiempo");

  const prescriptions = {
    poco_tiempo: {
      tag: "Active Recall + Enfoque Rápido",
      method: "Active Recall",
      duration: "25 minutos",
      items: ["5 preguntas clave", "3 ejercicios seleccionados", "1 repaso rápido"],
      note: "Prioriza retención directa de patrones sin lectura redundante ni pérdidas de tiempo.",
    },
    desde_cero: {
      tag: "Técnica Feynman + Desglose",
      method: "Técnica Feynman",
      duration: "40 minutos",
      items: ["Analogías intuitivas", "Explicación en voz alta", "2 ejemplos resueltos"],
      note: "Construye intuición sólida antes de saltar a la operatoria matemática avanzada.",
    },
    examen: {
      tag: "Simulación + Práctica Deliberada",
      method: "Práctica Deliberada",
      duration: "50 minutos",
      items: ["4 problemas tipo parcial", "Corrección de errores", "Checklist de verificación"],
      note: "Entrena velocidad, precisión y resolución bajo condiciones similares a la evaluación.",
    },
  };

  const current = prescriptions[context];

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
        
        {/* Columna Izquierda: Texto y Controles Interactivos (5 cols / ~42%) */}
        <div className="lg:col-span-5 text-left space-y-5 sm:space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue block">
            Estrategia de estudio
          </span>

          <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate leading-[1.08]">
            No todos los temas <br />
            se estudian igual.
          </h2>

          <p className="text-sm sm:text-base text-arctic-secondary leading-relaxed">
            studia+ evalúa tu tiempo disponible, tu nivel de comprensión y tu objetivo antes de iniciar, sugiriendo la técnica con mayor evidencia para ese momento.
          </p>

          {/* Selector de Contexto Interactivo */}
          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-arctic-tertiary block">
              Prueba un contexto diferente:
            </span>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-2.5">
              {[
                { id: "poco_tiempo", label: "Tengo poco tiempo", desc: "Bloques de 25 min y preguntas directas" },
                { id: "desde_cero", label: "Aprendiendo desde cero", desc: "Intuición conceptual y analogías" },
                { id: "examen", label: "Preparando parcial", desc: "Ejercicios tipo examen bajo presión" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setContext(btn.id as any)}
                  className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all border ${
                    context === btn.id
                      ? "bg-white border-glacier-blue/40 shadow-sm ring-2 ring-glacier-blue/10"
                      : "bg-white/60 border-black/[0.05] hover:bg-white hover:border-black/[0.1]"
                  }`}
                >
                  <span className={`text-xs font-bold block ${
                    context === btn.id ? "text-glacier-blue" : "text-arctic-slate"
                  }`}>
                    {btn.label}
                  </span>
                  <span className="text-xs text-arctic-secondary block mt-0.5">
                    {btn.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: UI Grande de Recomendación (7 cols / ~58%) */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl sm:rounded-4xl bg-white border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,25,60,0.06)] p-4 sm:p-9 text-left space-y-5 sm:space-y-6">
            
            {/* Cabecera de la prescripción */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-black/[0.05]">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-arctic-tertiary block">
                  Configuración Académica
                </span>
                <span className="text-xs sm:text-sm font-bold text-arctic-slate truncate block">
                  Cálculo Diferencial · Límites 0/0
                </span>
              </div>

              <span className="text-xs font-bold text-glacier-blue bg-glacier-blue/10 px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
                {current.tag}
              </span>
            </div>

            {/* Parámetros de la sesión */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-frost-base border border-black/[0.04]">
                <span className="text-xs uppercase font-bold text-arctic-tertiary block">Tema</span>
                <span className="font-bold text-arctic-slate block mt-0.5">Límites 0/0</span>
              </div>
              <div className="p-3 rounded-xl bg-frost-base border border-black/[0.04]">
                <span className="text-xs uppercase font-bold text-arctic-tertiary block">Nivel actual</span>
                <span className="font-semibold text-arctic-slate block mt-0.5">Entendido parcialmente</span>
              </div>
              <div className="p-3 rounded-xl bg-frost-base border border-black/[0.04]">
                <span className="text-xs uppercase font-bold text-arctic-tertiary block">Duración</span>
                <span className="font-mono font-bold text-glacier-blue block mt-0.5">{current.duration}</span>
              </div>
            </div>

            {/* Bloque Destacado del Método */}
            <div className="p-5 sm:p-6 rounded-2xl bg-glacier-blue/[0.035] border border-glacier-blue/20 space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-glacier-blue tracking-wider block">
                  Estrategia Recomendada
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight">
                  {current.method}
                </h3>
                <p className="text-xs sm:text-sm text-arctic-secondary">
                  {current.note}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                {current.items.map((it) => (
                  <div key={it} className="p-3 rounded-xl bg-white border border-black/[0.04] flex items-center gap-2">
                    <Check size={14} className="text-glacier-blue shrink-0" strokeWidth={2.5} />
                    <span className="font-medium text-arctic-slate">{it}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón CTA */}
            <div className="pt-2">
              <Link
                href="/registro"
                className="w-full btn-apple-primary py-3.5 px-6 rounded-xl font-semibold text-xs apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm"
              >
                <Play size={14} fill="currentColor" />
                <span>Empezar sesión con este método</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
