"use client";

import { 
  Sparkles, 
  Clock, 
  Target, 
  Trophy, 
  BrainCircuit, 
  Calendar, 
  MessageSquareQuote, 
  CheckCircle2, 
  Layers
} from "lucide-react";

export default function BentoFeatures() {
  return (
    <section id="caracteristicas" className="space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="tracking-wide text-xs font-semibold text-glacier-blue">
          Capacidades centrales
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          Diseñado para transformar el caos académico en claridad absoluta.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Cada herramienta fue concebida bajo principios de neuroeducación y diseño sensorial para eliminar la fricción al estudiar.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">

        {/* Bento 1: Rutas Curriculares con Gemini (8 cols) */}
        <div id="ia" className="md:col-span-8 apple-card p-7 sm:p-9 bg-white/90 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-glacier-blue/[0.07] blur-3xl pointer-events-none group-hover:bg-glacier-blue/[0.12] transition-colors" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center mb-4 shadow-apple-sm">
              <BrainCircuit size={20} />
            </div>
            <span className="tracking-wide text-xs font-semibold text-glacier-blue">
              Inteligencia curricular
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight mt-1.5 mb-2.5">
              Generación de Rutas de Estudio con IA
            </h3>
            <p className="text-sm text-arctic-secondary leading-relaxed max-w-xl">
              Pega el programa de tu asignatura o describe tus metas de aprendizaje. El motor Gemini 3.6 Flash desglosa el contenido en secuencias lógicas con tiempos estimados y niveles de dificultad.
            </p>
          </div>

          {/* Interactive Visual Element */}
          <div className="mt-6 pt-5 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "1. Sílabo Crudo", sub: "Ingreso en texto o PDF", icon: Layers },
              { label: "2. Síntesis IA", sub: "Modelado de prerrequisitos", icon: Sparkles },
              { label: "3. Ruta Óptima", sub: "Calendario dinámico", icon: CheckCircle2 }
            ].map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-frost-base/80 border border-black/[0.04] flex items-center gap-2.5">
                <step.icon size={16} className="text-glacier-blue shrink-0" />
                <div>
                  <p className="text-xs font-bold text-arctic-slate">{step.label}</p>
                  <p className="text-xs text-arctic-secondary">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento 2: Sesiones Pomodoro con XP (4 cols) */}
        <div className="md:col-span-4 apple-card p-7 sm:p-9 bg-white/90 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-polar-cyan/[0.08] blur-2xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-polar-cyan/10 text-sky-700 flex items-center justify-center mb-4 shadow-apple-sm">
              <Clock size={20} />
            </div>
            <span className="tracking-wide text-xs font-semibold text-sky-700">
              Enfoque físico
            </span>
            <h3 className="text-xl font-bold text-arctic-slate tracking-tight mt-1.5 mb-2.5">
              Sesiones de Concentración
            </h3>
            <p className="text-sm text-arctic-secondary leading-relaxed">
              Cronómetro inmersivo sin distracciones. Registra cada minuto de trabajo cognitivo y premia tu esfuerzo con puntos de experiencia.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-apple-green" />
              <span className="text-xs font-bold text-arctic-slate font-mono">25:00 Focus</span>
            </div>
            <span className="text-xs font-bold text-glacier-blue">+150 XP</span>
          </div>
        </div>

        {/* Bento 3: Radar de Evaluaciones (4 cols) */}
        <div className="md:col-span-4 apple-card p-7 sm:p-9 bg-white/90 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-cool-berry/10 text-cool-berry flex items-center justify-center mb-4 shadow-apple-sm">
              <Calendar size={20} />
            </div>
            <span className="tracking-wide text-xs font-semibold text-cool-berry">
              Gestión de parciales
            </span>
            <h3 className="text-xl font-bold text-arctic-slate tracking-tight mt-1.5 mb-2.5">
              Radar de Exámenes
            </h3>
            <p className="text-sm text-arctic-secondary leading-relaxed">
              Monitorea fechas críticas, porcentajes de ponderación y notas objetivo para no dejar el estudio a última hora.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="p-3 rounded-xl bg-frost-base border border-black/[0.05] flex items-center justify-between text-xs">
              <span className="font-semibold text-arctic-slate">Primer Parcial (30%)</span>
              <span className="text-cool-berry font-bold">En 3 días</span>
            </div>
            <div className="p-3 rounded-xl bg-frost-base border border-black/[0.05] flex items-center justify-between text-xs">
              <span className="font-semibold text-arctic-slate">Taller Práctico</span>
              <span className="text-arctic-secondary font-medium">Completado</span>
            </div>
          </div>
        </div>

        {/* Bento 4: Tutor Contextual 24/7 (8 cols) */}
        <div className="md:col-span-8 apple-card p-7 sm:p-9 bg-white/90 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -left-12 -bottom-12 w-60 h-60 rounded-full bg-cool-iris/[0.07] blur-3xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-cool-iris/10 text-cool-iris flex items-center justify-center mb-4 shadow-apple-sm">
              <MessageSquareQuote size={20} />
            </div>
            <span className="tracking-wide text-xs font-semibold text-cool-iris">
              Tutor privado integrado
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight mt-1.5 mb-2.5">
              Preguntas y Consultas en Tiempo Real
            </h3>
            <p className="text-sm text-arctic-secondary leading-relaxed max-w-xl">
              ¿Te trabaste en un teorema o concepto? Consulta al tutor integrado en cada tema para obtener explicaciones paso a paso con analogías sencillas y ejercicios de práctica.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-frost-base/90 border border-black/[0.05] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-cool-iris text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-apple-sm">
              AI
            </div>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-arctic-slate">Explicación intuitiva generada:</p>
              <p className="text-arctic-secondary leading-relaxed">
                “Imagina las coordenadas cilíndricas como si estuvieras en un ascensor circular: mides la distancia al centro (r), el giro en grados (θ) y la altura del piso (z).”
              </p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
