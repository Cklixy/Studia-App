import { Calendar, CheckCircle2, Circle, Clock, Check } from "lucide-react";

export default function ExamsSection() {
  return (
    <section id="parciales" className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-cool-berry">
          Planificación de evaluaciones
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          No estudies para el parcial la noche anterior.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Organiza tus sesiones según las fechas y temas que realmente importan para llegar con seguridad.
        </p>
      </div>

      {/* Mockup del Radar de Parciales */}
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Tarjeta Principal de Examen */}
        <div className="rounded-[28px] bg-white border border-black/[0.08] shadow-[0_20px_50px_-12px_rgba(0,25,60,0.06)] p-6 sm:p-8 space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.05]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-arctic-tertiary">
                Evaluación Principal
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-arctic-slate tracking-tight">
                Cálculo Diferencial · Primer Parcial
              </h3>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 self-start sm:self-auto">
              <Calendar size={13} />
              <span>En 12 días</span>
            </span>
          </div>

          {/* Barra de progreso de preparación */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-arctic-secondary font-medium">Progreso temático</span>
              <span className="font-bold text-arctic-slate">5 de 8 temas revisados</span>
            </div>
            
            {/* Visual Progress Track */}
            <div className="w-full h-2 rounded-full bg-black/[0.05] overflow-hidden">
              <div className="h-full bg-glacier-blue rounded-full" style={{ width: "62%" }} />
            </div>
          </div>

          {/* Lista de temas del examen */}
          <div className="space-y-2.5 pt-2">
            <div className="p-3 rounded-xl bg-frost-base/80 border border-black/[0.03] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                <span className="font-semibold text-arctic-slate">Límites y continuidad</span>
              </div>
              <span className="text-[11px] font-medium text-emerald-600">Completado</span>
            </div>

            <div className="p-3 rounded-xl bg-glacier-blue/[0.03] border border-glacier-blue/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-glacier-blue/15 text-glacier-blue flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ◐
                </span>
                <span className="font-semibold text-arctic-slate">Reglas de derivación</span>
              </div>
              <span className="text-[11px] font-semibold text-glacier-blue">En curso · 2 sesiones</span>
            </div>

            <div className="p-3 rounded-xl bg-frost-base/80 border border-black/[0.03] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-black/[0.05] text-arctic-tertiary flex items-center justify-center shrink-0 text-[10px]">
                  ○
                </span>
                <span className="font-medium text-arctic-secondary">Optimización y aplicaciones</span>
              </div>
              <span className="text-[11px] text-arctic-tertiary">Pendiente</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
