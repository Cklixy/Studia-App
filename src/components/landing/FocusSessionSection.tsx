"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function FocusSessionSection() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Modo concentración
        </span>
        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate">
          Cuando sabes qué hacer, solo queda hacerlo.
        </h2>
      </div>

      {/* Mockup de Sesión a Gran Escala (75% del ancho desktop con amplio espacio negativo) */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="rounded-[32px] bg-white border border-black/[0.08] shadow-[0_25px_60px_-15px_rgba(0,25,60,0.07)] p-8 sm:p-14 md:p-20 text-center space-y-10">
          
          {/* Materia y Estado */}
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
            <span className="text-xs font-semibold text-arctic-secondary">
              Cálculo Diferencial
            </span>
            <span className="text-xs font-bold text-glacier-blue bg-glacier-blue/10 px-3 py-1 rounded-full">
              Bloque de 25 min
            </span>
          </div>

          {/* Temporizador Gigante Dominante */}
          <div className="space-y-4 py-4">
            <span className="text-6xl sm:text-8xl md:text-9xl font-bold font-mono text-arctic-slate tabular-nums tracking-tight block">
              25:00
            </span>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-arctic-slate tracking-tight">
                Límites indeterminados 0/0
              </h3>
              
              <p className="text-xs sm:text-sm text-arctic-secondary">
                <span className="font-semibold text-arctic-slate">Objetivo:</span>{" "}
                Resolver límites mediante factorización y cancelación de términos.
              </p>
            </div>
          </div>

          {/* Botón Táctil de Gran Presencia */}
          <div className="pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="btn-apple-primary text-sm py-4 px-10 font-semibold apple-tactile inline-flex items-center gap-2.5 shadow-apple-md rounded-full text-base"
            >
              {isRunning ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              <span>{isRunning ? "Pausar sesión" : "Iniciar enfoque"}</span>
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
