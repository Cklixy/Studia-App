import { Clock, Flame, BookOpen, Sigma, Code2, Award } from "lucide-react";

export default function ProgressAndHabitsSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue">
          Constancia y registro
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          Tu estudio deja de ser invisible.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Registra el tiempo real dedicado, los métodos empleados y cómo se consolida tu hábito semana a semana.
        </p>
      </div>

      {/* Grid de Registro y Hábito */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Registro Semanal de Sesiones (7 cols) */}
        <div className="md:col-span-7 rounded-3xl bg-white border border-black/[0.08] shadow-[0_16px_40px_-12px_rgba(0,25,60,0.06)] p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
          
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <span className="text-xs font-semibold text-arctic-tertiary uppercase tracking-wider">
              Ejemplo de Registro Semanal
            </span>
            <span className="text-xs font-bold text-arctic-slate bg-frost-base px-2.5 py-1 rounded-full border border-black/[0.04]">
              4 sesiones
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-arctic-slate tabular-nums tracking-tight">
                2 h 35 min
              </span>
            </div>
            <p className="text-xs text-arctic-secondary">
              Tiempo efectivo de enfoque acumulado
            </p>
          </div>

          {/* Desglose por materia */}
          <div className="space-y-2.5 pt-2">
            <div className="p-3 rounded-xl bg-frost-base/90 border border-black/[0.03] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Sigma size={13} strokeWidth={2} />
                </div>
                <span className="font-semibold text-arctic-slate">Cálculo Diferencial</span>
              </div>
              <span className="text-arctic-secondary font-medium">3 sesiones · 1 h 50 min</span>
            </div>

            <div className="p-3 rounded-xl bg-frost-base/90 border border-black/[0.03] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-700 flex items-center justify-center">
                  <Code2 size={13} strokeWidth={2} />
                </div>
                <span className="font-semibold text-arctic-slate">Programación Orientada a Objetos</span>
              </div>
              <span className="text-arctic-secondary font-medium">1 sesión · 45 min</span>
            </div>
          </div>

          <div className="text-xs text-arctic-tertiary pt-2 border-t border-black/[0.04] flex items-center justify-between">
            <span>Método más frecuente: Pomodoro</span>
            <span className="text-emerald-700 font-medium">85% metas cumplidas</span>
          </div>

        </div>

        {/* Gamificación Sutil (5 cols) */}
        <div className="md:col-span-5 rounded-3xl bg-white border border-black/[0.08] shadow-[0_16px_40px_-12px_rgba(0,25,60,0.06)] p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
          
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <span className="text-xs font-semibold text-arctic-tertiary uppercase tracking-wider">
              Hábito y Constancia
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Flame size={24} className="fill-amber-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight">
                7 días de racha
              </h3>
              <p className="text-xs text-arctic-secondary leading-relaxed">
                El hábito de estudio se consolida con presencia diaria, no con desvelos de última hora.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-frost-base/90 border border-black/[0.03] space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-arctic-secondary font-medium">Puntos de experiencia</span>
              <span className="font-bold text-glacier-blue">+240 XP esta semana</span>
            </div>
            <p className="text-xs text-arctic-tertiary">
              Recompensa por sesiones completadas a tiempo
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
