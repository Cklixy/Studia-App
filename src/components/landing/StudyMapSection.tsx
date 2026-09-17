import { Check, ArrowDown, Sparkles, BookOpen, Layers } from "lucide-react";

export default function StudyMapSection() {
  const nodes = [
    { title: "Límites intuitivos y concepto", status: "completed", note: "Fundamentos teóricos" },
    { title: "Propiedades algebraicas de los límites", status: "completed", note: "Suma, producto y cociente" },
    { title: "Límites laterales y existencia", status: "completed", note: "Comportamiento por izquierda y derecha" },
    { title: "Límites infinitos y al infinito", status: "active", note: "En curso · Tu sesión de hoy" },
    { title: "Indeterminaciones 0/0 y factorización", status: "next", note: "Siguiente paso prioritario" },
    { title: "Racionalización de radicales", status: "pending", note: "Práctica de álgebra" },
    { title: "Asíntotas verticales y horizontales", status: "pending", note: "Aplicación gráfica" },
  ];

  return (
    <section id="mapa" className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Estructura curricular
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          Un tema grande se vuelve fácil cuando lo ves en partes.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          studia+ desglosa asignaturas complejas en secuencias lógicas para que nunca te sientas abrumado.
        </p>
      </div>

      {/* Contenedor del Mapa de Estudio */}
      <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,25,60,0.06)] p-6 sm:p-10">
        
        {/* Cabecera del Módulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-8 border-b border-black/[0.06]">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-glacier-blue uppercase tracking-wider">
              Ruta Académica · Cálculo Diferencial
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-arctic-slate tracking-tight">
              Módulo: Límites y Continuidad
            </h3>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-arctic-secondary bg-frost-base px-3 py-1.5 rounded-full border border-black/[0.04] self-start sm:self-auto">
            <Layers size={13} className="text-glacier-blue" />
            <span>3 de 7 temas dominados</span>
          </span>
        </div>

        {/* Nodos de la Ruta */}
        <div className="relative max-w-xl mx-auto space-y-3">
          
          {/* Línea conectora vertical sutil */}
          <div className="absolute left-[21px] top-6 bottom-6 w-[2px] bg-black/[0.06] -z-0" />

          {nodes.map((node, idx) => {
            const isCompleted = node.status === "completed";
            const isActive = node.status === "active";
            const isNext = node.status === "next";

            return (
              <div
                key={node.title}
                className={`relative z-10 flex items-start gap-4 p-3.5 sm:p-4 rounded-[18px] transition-all ${
                  isActive
                    ? "bg-glacier-blue/[0.04] border border-glacier-blue/25 shadow-sm"
                    : isNext
                    ? "bg-white border border-black/[0.06]"
                    : "bg-white/60 border border-black/[0.03] opacity-80"
                }`}
              >
                {/* Indicador de estado */}
                <div
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 border font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                      : isActive
                      ? "bg-glacier-blue text-white border-glacier-blue shadow-apple-sm"
                      : isNext
                      ? "bg-white border-black/[0.12] text-arctic-slate"
                      : "bg-black/[0.02] border-black/[0.06] text-arctic-tertiary"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>

                {/* Contenido del Nodo */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-sm sm:text-base font-semibold tracking-tight ${
                        isActive ? "text-glacier-blue" : "text-arctic-slate"
                      }`}
                    >
                      {node.title}
                    </h4>

                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-glacier-blue/10 text-glacier-blue px-2 py-0.5 rounded-full">
                        En curso
                      </span>
                    )}
                    {isNext && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/[0.04] text-arctic-secondary px-2 py-0.5 rounded-full">
                        Siguiente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-arctic-secondary">
                    {node.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
