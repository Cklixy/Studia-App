"use client";

import { Sigma, Clock, Target, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroProductMockup() {
  return (
    <div className="relative w-full max-w-xl lg:max-w-none mx-auto select-none">
      {/* Sombra ambiental ultra-suave */}
      <div className="absolute -inset-2 bg-gradient-to-b from-glacier-blue/[0.08] to-transparent rounded-[32px] blur-2xl pointer-events-none" />

      {/* Ventana de Producto Real de studia+ */}
      <div className="relative bg-white border border-black/[0.08] rounded-[24px] shadow-[0_24px_50px_-12px_rgba(0,25,60,0.09),0_2px_8px_rgba(0,0,0,0.03)] p-5 sm:p-8 text-left space-y-5 sm:space-y-6">
        
        {/* Cabecera superior sutil de la ventana */}
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
            <span className="ml-1.5 text-xs font-semibold text-arctic-tertiary">
              Nueva sesión
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-glacier-blue/10 text-glacier-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-glacier-blue animate-pulse" />
            Preparada
          </span>
        </div>

        {/* Bloque Materia y Tema */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-blue-500/[0.08] border border-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <Sigma size={20} strokeWidth={2} />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-xs font-semibold text-arctic-secondary block truncate">
                Cálculo Diferencial
              </span>
              <p className="text-lg sm:text-xl font-bold text-arctic-slate tracking-tight truncate">
                Límites
              </p>
            </div>
          </div>

          {/* Contexto seleccionado */}
          <div className="p-3 rounded-2xl bg-frost-base/90 border border-black/[0.04] flex items-center justify-between text-xs gap-2">
            <span className="text-arctic-secondary font-medium shrink-0">Contexto</span>
            <span className="font-semibold text-arctic-slate bg-white px-2.5 py-0.5 rounded-lg border border-black/[0.04] truncate">
              Quiero practicar
            </span>
          </div>

          {/* Método Recomendado */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-glacier-blue/[0.035] border border-glacier-blue/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-glacier-blue tracking-wider block">
                Método recomendado
              </span>
              <span className="text-xs font-mono font-bold text-glacier-blue">
                25 min
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
              <span className="text-sm font-bold text-arctic-slate">
                Active Recall
              </span>
              <span className="text-[11px] text-arctic-secondary">
                Preguntas activas + ejercicios
              </span>
            </div>
          </div>
        </div>

        {/* CTA Comenzar sesión de estudio */}
        <div className="pt-2">
          <Link
            href="/sesion/nueva"
            className="w-full btn-apple-primary py-3 px-6 rounded-xl font-semibold text-xs apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm"
          >
            <Play size={14} fill="currentColor" />
            <span>Comenzar sesión de estudio</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
