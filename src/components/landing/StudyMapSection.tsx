import { Check, ArrowDown, Sparkles, Layers, CheckCircle2 } from "lucide-react";

export default function StudyMapSection() {
  const learningPath = [
    { title: "Límites", status: "completed", note: "Concepto intuitivo y definición formal" },
    { title: "Límites laterales", status: "completed", note: "Existencia y comportamiento por izquierda/derecha" },
    { title: "Indeterminaciones 0/0", status: "active", note: "Tu sesión actual · Factorización algebraica" },
    { title: "Factorización de polinomios", status: "next", note: "Diferencia de cuadrados y trinomios" },
    { title: "Conjugados y racionalización", status: "pending", note: "Eliminación de radicales en cocientes" },
    { title: "Asíntotas", status: "pending", note: "Límites al infinito y asíntotas verticales" },
    { title: "Derivadas", status: "pending", note: "Razón de cambio instantánea" },
  ];

  return (
    <section id="funciones" className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
        
        {/* Columna Izquierda: Explicación Editorial (5 cols / ~42%) */}
        <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5">
          <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue block">
            Estructura de aprendizaje
          </span>

          <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate leading-[1.08]">
            No necesitas otra lista de temas. <br />
            <span className="text-glacier-blue">Necesitas un camino.</span>
          </h2>

          <p className="text-sm sm:text-base text-arctic-secondary leading-relaxed">
            La IA organiza un tema en subtemas relacionados para ayudarte a entender qué estudiar primero y qué estudiar después.
          </p>

          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 text-xs sm:text-sm text-arctic-secondary">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Ordena los fundamentos antes de abordar casos complejos.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Detecta dependencias para no saltar pasos críticos.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Transforma un sílabo denso en una ruta secuencial de 7 etapas.</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mapa Visual Grande (7 cols / ~58%) */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl sm:rounded-4xl bg-white border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,25,60,0.06)] p-4 sm:p-9 text-left">
            
            {/* Cabecera del Módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-black/[0.05]">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-glacier-blue">
                  Cálculo Diferencial
                </span>
                <h3 className="text-base sm:text-xl font-bold text-arctic-slate tracking-tight">
                  Ruta de Estudio: Límites y Continuidad
                </h3>
              </div>

              <span className="text-xs text-arctic-secondary bg-frost-base px-3 py-1 rounded-full border border-black/[0.04] self-start sm:self-auto font-medium">
                2 de 7 completados
              </span>
            </div>

            {/* Nodos de la ruta anchos */}
            <div className="relative space-y-2.5 sm:space-y-3">
              {/* Línea vertical conectora */}
              <div className="absolute left-[19px] sm:left-[22px] top-5 sm:top-6 bottom-5 sm:bottom-6 w-[2px] bg-black/[0.05] -z-0" />

              {learningPath.map((node, index) => {
                const isCompleted = node.status === "completed";
                const isActive = node.status === "active";
                const isNext = node.status === "next";

                return (
                  <div
                    key={node.title}
                    className={`relative z-10 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-glacier-blue/[0.04] border-glacier-blue/30 shadow-sm"
                        : isNext
                        ? "bg-white border-black/[0.08]"
                        : isCompleted
                        ? "bg-white/90 border-black/[0.04]"
                        : "bg-white/60 border-black/[0.03]"
                    }`}
                  >
                    {/* Indicador de estado */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                          : isActive
                          ? "bg-glacier-blue text-white shadow-apple-sm"
                          : "bg-black/[0.03] text-arctic-tertiary border border-black/[0.06]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={2.5} />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      ) : (
                        <span>0{index + 1}</span>
                      )}
                    </div>

                    {/* Info del tema */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                      <div className="min-w-0">
                        <p className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                          isActive ? "text-glacier-blue" : isCompleted || isNext ? "text-arctic-slate" : "text-arctic-secondary"
                        }`}>
                          {node.title}
                        </p>
                        <p className="text-xs text-arctic-secondary truncate">
                          {node.note}
                        </p>
                      </div>

                      {isActive && (
                        <span className="text-xs font-bold uppercase tracking-wider text-glacier-blue bg-glacier-blue/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 self-start sm:self-auto">
                          Tu sesión actual
                        </span>
                      )}
                      {isNext && (
                        <span className="text-xs font-semibold text-arctic-tertiary bg-black/[0.04] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 self-start sm:self-auto">
                          Siguiente paso
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
