import { ArrowDown, Sigma, Sparkles, Clock, Target, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      stepName: "ELIGE",
      title: "Selecciona la materia y el tema",
      desc: "Elige exactamente qué quieres estudiar hoy sin perderte en apuntes interminables.",
      visual: (
        <div className="p-4 rounded-2xl bg-fondo border border-linea space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-acento/10 text-acento flex items-center justify-center text-xs font-bold">
              Σ
            </span>
            <span className="text-xs font-bold text-tinta">Cálculo Diferencial</span>
          </div>
          <div className="pl-8">
            <ArrowDown size={12} className="text-tinta-3 mb-1" />
            <span className="inline-block text-xs font-semibold text-tinta bg-superficie px-2.5 py-1 rounded-md border border-linea">
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
        <div className="p-4 rounded-2xl bg-fondo border border-linea space-y-2 text-left">
          <span className="text-xs uppercase font-bold text-acento tracking-wider block">
            Método recomendado
          </span>
          <div className="p-2.5 rounded-xl bg-superficie border border-linea space-y-1">
            <span className="text-xs font-bold text-tinta block">
              Active Recall
            </span>
            <span className="text-xs text-tinta-2 block">
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
        <div className="p-4 rounded-2xl bg-fondo border border-linea space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-acento bg-superficie px-2 py-0.5 rounded border border-linea">
              25:00 Focus
            </span>
            <span className="text-xs text-exito font-semibold bg-exito/10 px-2 py-0.5 rounded-full">
              En curso
            </span>
          </div>
          <p className="text-xs font-semibold text-tinta pt-0.5">
            Límites indeterminados 0/0
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="como-funciona" className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto space-y-10 sm:space-y-12 w-full">
      
      {/* Encabezado */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-acento">
          Cómo funciona
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-tinta">
          De estudiar a ciegas a tener un plan.
        </h2>
        <p className="text-sm sm:text-base text-tinta-2">
          Una secuencia de tres pasos que convierte cualquier temario abrumador en una sesión de estudio clara.
        </p>
      </div>

      {/* Los 3 Pasos Visuales en Grid Amplio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-5 sm:p-8 rounded-3xl bg-superficie border border-linea shadow-2 flex flex-col justify-between space-y-5 sm:space-y-6 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-acento bg-acento/10 px-2.5 py-0.5 rounded-full">
                  {s.num}
                </span>
                <span className="text-xs font-bold tracking-wider text-tinta-3">
                  {s.stepName}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-tinta tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-tinta-2 leading-relaxed">
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
