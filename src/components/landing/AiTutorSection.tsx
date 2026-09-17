import { MessageSquareQuote, CheckCircle2, Sparkles, Check } from "lucide-react";

export default function AiTutorSection() {
  return (
    <section id="ia" className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
        
        {/* Columna Izquierda: Explicación (5 cols / ~42%) */}
        <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue block">
            Tutor académico integrado
          </span>

          <h2 className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate leading-[1.08]">
            Cuando te atasques, <br />
            <span className="text-glacier-blue">pregunta.</span>
          </h2>

          <p className="text-sm sm:text-base text-arctic-secondary leading-relaxed">
            Explica el concepto que no entiendes y recibe explicaciones paso a paso, ejemplos y ejercicios para seguir avanzando sin salir de tu sesión.
          </p>

          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 text-xs sm:text-sm text-arctic-secondary">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Respuestas directas adaptadas al temario de tu universidad.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Analogías del mundo real para conceptos matemáticos abstractos.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-glacier-blue shrink-0 mt-0.5" />
              <span>Mini ejercicios para verificar que realmente entendiste el paso.</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Ventana Realista Grande de Conversación (7 cols / ~58%) */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(0,25,60,0.06)] p-4 sm:p-9 text-left space-y-4 sm:space-y-5">
            
            {/* Cabecera del tutor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3.5 border-b border-black/[0.05]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-apple-green shrink-0" />
                <span className="text-xs font-bold text-arctic-slate truncate">
                  Tutor Contextual · Cálculo Diferencial
                </span>
              </div>

              <span className="text-[11px] sm:text-xs text-arctic-tertiary font-medium shrink-0">
                Tema: Límites Indeterminados
              </span>
            </div>

            {/* Mensaje del estudiante */}
            <div className="flex justify-end">
              <div className="max-w-lg p-3.5 sm:p-4 rounded-2xl rounded-tr-sm bg-glacier-blue text-white text-xs sm:text-sm leading-relaxed shadow-sm">
                <p className="font-medium">
                  ¿Por qué este límite me da 0/0 si reemplazo directamente el valor?
                </p>
              </div>
            </div>

            {/* Respuesta del tutor */}
            <div className="flex justify-start items-start gap-3.5 pt-1">
              <div className="w-8 h-8 rounded-xl bg-cool-iris/10 text-cool-iris flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                AI
              </div>

              <div className="max-w-xl p-5 rounded-2xl rounded-tl-sm bg-frost-base border border-black/[0.04] text-xs sm:text-sm text-arctic-slate space-y-3 leading-relaxed">
                <p>
                  La expresión <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-black/[0.06]">0/0</span> no es el resultado numérico final. Es una <strong className="text-glacier-blue">indeterminación</strong>: significa que tanto el numerador como el denominador contienen un factor común que se anula en ese punto.
                </p>

                <p className="text-arctic-secondary">
                  Para resolverlo, primero factorizamos ambos polinomios para cancelar el término que genera el cero y luego volvemos a evaluar el límite.
                </p>

                {/* Micro-ejercicio práctico */}
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-glacier-blue block">
                    Comprobación con un ejercicio
                  </span>
                  <p className="font-mono text-xs sm:text-sm font-bold text-arctic-slate">
                    lim (x → 2) [ (x² - 4) / (x - 2) ]
                  </p>
                  <p className="text-xs text-arctic-secondary leading-relaxed">
                    Factorizamos el numerador: <span className="font-mono text-arctic-slate font-semibold">(x - 2)(x + 2)</span>. <br />
                    Cancelamos <span className="font-mono text-arctic-slate font-semibold">(x - 2)</span> y evaluamos: <span className="font-semibold text-emerald-600">2 + 2 = 4</span>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
