import { Calendar, Check, Circle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ExamsSection() {
  const topics = [
    { title: "Límites y continuidad", done: true },
    { title: "Límites laterales y existencia", done: true },
    { title: "Límites infinitos y asíntotas", done: false },
    { title: "Comportamiento asintótico", done: false },
    { title: "Introducción a derivadas", done: false },
  ];

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 items-center">

        {/* Columna Izquierda: Texto (5 cols / ~42%) */}
        <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5">
          <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue block">
            Planificación estratégica
          </span>

          <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate leading-[1.08]">
            Prepárate antes de que <br />
            <span className="text-glacier-blue">llegue el parcial.</span>
          </h2>

          <p className="text-sm sm:text-base text-arctic-secondary leading-relaxed">
            Organiza tus sesiones según las fechas y temas que realmente importan. Visualiza con claridad qué temas dominas y cuáles tienes pendientes antes del día del examen.
          </p>

          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 text-xs sm:text-sm text-arctic-secondary">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Monitoreo de días restantes y porcentajes de avance.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Priorización automática de temas débiles.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Elimina la necesidad de desvelarte la noche anterior.</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mockup Grande de Parcial (7 cols / ~58%) */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl sm:rounded-4xl bg-white border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,25,60,0.06)] p-4 sm:p-9 space-y-5 sm:space-y-6 text-left">

            {/* Cabecera del Parcial */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.05]">
              <div>
                <span className="text-xs font-semibold text-glacier-blue block">
                  Cálculo Diferencial
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-arctic-slate tracking-tight">
                  Segundo Parcial
                </h3>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto">
                <span className="text-xs font-medium text-arctic-secondary flex items-center gap-1.5">
                  <Calendar size={13} className="text-arctic-tertiary shrink-0" />
                  En 12 días
                </span>
                <span className="text-xs font-bold text-glacier-blue bg-glacier-blue/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
                  72% preparado
                </span>
              </div>
            </div>

            {/* Lista de Temas del Parcial a Escala Amplia */}
            <div className="space-y-2 sm:space-y-2.5 text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-arctic-tertiary block mb-1.5 sm:mb-2">
                Temas del examen:
              </span>

              {topics.map((t) => (
                <div
                  key={t.title}
                  className="p-3 sm:p-3.5 rounded-xl bg-frost-base/90 border border-black/[0.03] flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      t.done
                        ? "bg-emerald-500/10 text-emerald-700 font-bold"
                        : "bg-black/[0.04] text-arctic-tertiary"
                    }`}>
                      {t.done ? <Check size={13} strokeWidth={2.5} /> : <span className="text-xs">○</span>}
                    </span>
                    <span className={`font-medium truncate text-xs sm:text-[13px] ${t.done ? "text-arctic-slate" : "text-arctic-secondary"}`}>
                      {t.title}
                    </span>
                  </div>

                  <span className={`text-xs shrink-0 ${t.done ? "text-emerald-700 font-semibold" : "text-arctic-tertiary"}`}>
                    {t.done ? "Dominado" : "Por repasar"}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Ver preparación */}
            <div className="pt-2">
              <Link
                href="/registro"
                className="w-full btn-apple-secondary text-xs py-3 px-5 font-semibold apple-tactile inline-flex items-center justify-center gap-2 rounded-xl"
              >
                <span>Ver preparación del parcial</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
