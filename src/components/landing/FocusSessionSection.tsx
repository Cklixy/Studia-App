"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";

export default function FocusSessionSection() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-acento">
          Modo concentración
        </span>
        <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-tinta">
          Cuando sabes qué hacer, solo queda hacerlo.
        </h2>
      </div>

      {/* Mockup de Sesión a Gran Escala (75% del ancho desktop con amplio espacio negativo) */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="rounded-4xl sm:rounded-4xl bg-superficie border border-linea shadow-2 p-6 sm:p-14 md:p-20 text-center space-y-7 sm:space-y-10">
          
          {/* Materia y Estado */}
          <div className="flex items-center justify-between border-b border-linea pb-3.5 sm:pb-4">
            <span className="text-xs font-semibold text-tinta-2 truncate">
              Cálculo Diferencial
            </span>
            <span className="text-xs font-bold text-acento bg-acento/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
              Bloque de 25 min
            </span>
          </div>

          {/* Temporizador Gigante Dominante */}
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono text-tinta tabular-nums tracking-tight block">
              25:00
            </span>

            <div className="space-y-1.5 sm:space-y-2 max-w-md mx-auto">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-tinta tracking-tight">
                Límites indeterminados 0/0
              </h3>
              
              <p className="text-xs sm:text-sm text-tinta-2 leading-relaxed">
                <span className="font-semibold text-tinta">Objetivo:</span>{" "}
                Resolver límites mediante factorización y cancelación de términos.
              </p>
            </div>
          </div>

          {/* Botón Táctil de Gran Presencia */}
          <div className="pt-1 sm:pt-2 flex justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-full sm:w-auto btn-primario text-xs sm:text-sm py-3.5 sm:py-4 px-8 sm:px-10 font-semibold tactil inline-flex items-center justify-center gap-2.5 shadow-2 rounded-full"
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
