import { ArrowDown, Sigma, Sparkles, Clock, Target, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      stepName: "ELIGE",
      title: "Selecciona la materia y el tema",
      desc: "Elige exactamente qué quieres estudiar hoy sin perderte en apuntes interminables.",
      visual: (
        <div className="p-4 rounded-2xl bg-frost-base border border-black/[0.04] space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-bold">
              Σ
            </span>
            <span className="text-xs font-bold text-arctic-slate">Cálculo Diferencial</span>
          </div>
          <div className="pl-8">
            <ArrowDown size={12} className="text-arctic-tertiary mb-1" />
            <span className="inline-block text-xs font-semibold text-arctic-slate bg-white px-2.5 py-1 rounded-md border border-black/[0.05]">
              Límites
            </span>
          </div>
        </div>
      ),
    },
    {
      num: "02",
      stepName: "ENTIENDE",
      title: "Recibe tu estrategia adaptada",
      desc: "studia+ analiza tu contexto y recomienda una estrategia de estudio efectiva.",
      visual: (
        <div className="p-4 rounded-2xl bg-frost-base border border-black/[0.04] space-y-2 text-left">
          <span className="text-[10px] uppercase font-bold text-glacier-blue tracking-wider block">
            Método recomendado
          </span>
          <div className="p-2.5 rounded-xl bg-white border border-black/[0.05] space-y-1">
            <span className="text-xs font-bold text-arctic-slate block">
              Active Recall
            </span>
            <span className="text-[11px] text-arctic-secondary block">
              5 preguntas de retención + ejercicios prácticos
            </span>
          </div>
        </div>
      ),
    },
    {
      num: "03",
      stepName: "ENFÓCATE",
      title: "Inicia tu sesión con objetivo",
      desc: "Inicia una sesión con un objetivo concreto y registra lo que lograste al finalizar.",
      visual: (
        <div className="p-4 rounded-2xl bg-frost-base border border-black/[0.04] space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-glacier-blue bg-white px-2 py-0.5 rounded border border-black/[0.04]">
              25:00 Focus
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              En curso
            </span>
          </div>
          <p className="text-xs font-semibold text-arctic-slate pt-0.5">
            Límites indeterminados 0/0
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="como-funciona" className="px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto space-y-12 w-full">
      
      {/* Encabezado */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Cómo funciona
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-arctic-slate">
          De estudiar a ciegas a tener un plan.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Una secuencia de tres pasos que convierte cualquier temario abrumador en una sesión de estudio clara.
        </p>
      </div>

      {/* Los 3 Pasos Visuales en Grid Amplio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-7 sm:p-8 rounded-[26px] bg-white border border-black/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-glacier-blue bg-glacier-blue/10 px-2.5 py-0.5 rounded-full">
                  {s.num}
                </span>
                <span className="text-[11px] font-bold tracking-wider text-arctic-tertiary">
                  {s.stepName}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-arctic-slate tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-arctic-secondary leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>

            {/* Micro UI real representativa */}
            <div className="pt-2">
              {s.visual}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
