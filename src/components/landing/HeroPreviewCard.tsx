"use client";

import { Flame, Sparkles, Clock, Target, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export default function HeroPreviewCard() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Cold light glow backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-glacier-blue/20 via-polar-cyan/15 to-cool-iris/20 rounded-4xl blur-2xl opacity-70 pointer-events-none transform -translate-y-4" />

      {/* Main Glassmorphic Dashboard Window */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,30,80,0.12),0_4px_16px_rgba(0,0,0,0.03)] p-5 sm:p-7 md:p-9 overflow-hidden transition-all duration-300">
        
        {/* Fake Window Control Dots (macOS style) */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-black/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-black/10" />
            <span className="w-3 h-3 rounded-full bg-black/10" />
            <span className="w-3 h-3 rounded-full bg-black/10" />
            <span className="ml-2 text-xs font-semibold text-arctic-secondary">studia+ • Panel Académico</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.06] text-arctic-secondary text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              Sesión activa
            </span>
          </div>
        </div>

        {/* Inner Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Left Column: Activity & Streak Card (4 cols) */}
          <div className="md:col-span-4 apple-card p-5 bg-white/70 flex flex-col justify-between relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-arctic-secondary">Racha Semanal</span>
              <span className="flex items-center gap-1 text-cool-berry font-bold text-xs px-2 py-0.5 rounded-full bg-cool-berry/10">
                <Flame size={13} className="fill-cool-berry" />
                12 días
              </span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.05)" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#0071E3" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="60" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-arctic-slate tabular-nums">92%</span>
                <span className="text-xs font-semibold text-arctic-secondary uppercase">Meta</span>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between text-xs">
              <span className="text-arctic-secondary">XP acumulado:</span>
              <span className="font-bold text-glacier-blue">+1,450 XP</span>
            </div>
          </div>

          {/* Right Column: Next Priority Topic (8 cols) */}
          <div className="md:col-span-8 apple-card p-6 bg-gradient-to-br from-white/95 to-frost-base/80 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-glacier-blue/[0.06] blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-polar-cyan/10 border border-polar-cyan/20 text-sky-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} />
                Siguiente Paso Prioritario
              </div>

              <div className="mt-3">
                <span className="text-xs font-semibold text-arctic-secondary uppercase tracking-wider">
                  Cálculo Multivariado • Parcial en 4 días
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight mt-1">
                  Integrales Triples en Coordenadas Cilíndricas
                </h3>
                <p className="text-xs sm:text-sm text-arctic-secondary mt-1.5 line-clamp-2">
                  La IA detectó que este es el tema con mayor peso evaluativo pendiente de consolidación según tu sílabo.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-black/[0.06]">
              <div className="flex items-center gap-3 text-xs text-arctic-secondary">
                <span className="flex items-center gap-1"><Clock size={13} className="text-glacier-blue" /> 25 min</span>
                <span className="flex items-center gap-1"><Target size={13} className="text-sky-700" /> 5 ejercicios</span>
              </div>

              <div className="btn-apple-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 font-semibold shadow-apple-sm">
                <span>Comenzar enfoque</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Floating Notification Pill (Simulated AI Agent) */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/90 border border-black/[0.06] shadow-apple-sm flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cool-iris/10 text-cool-iris flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-arctic-slate">
                Ruta optimizada con Gemini 3.6 Flash
              </p>
              <p className="text-xs text-arctic-secondary">
                Se reorganizó tu calendario para maximizar tu retención antes del examen final.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-glacier-blue px-3 py-1 rounded-full bg-glacier-blue/10 whitespace-nowrap">
            Sincronizado
          </span>
        </div>

      </div>
    </div>
  );
}
