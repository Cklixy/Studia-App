import { ArrowRight, BookOpen, Clock, Target, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      tag: "Elige",
      title: "Selecciona tu materia y tema",
      desc: "Elige exactamente en qué necesitas avanzar hoy sin perderte en temarios gigantescos.",
    },
    {
      num: "02",
      tag: "Entiende",
      title: "Recibe el método recomendado",
      desc: "studia+ sugiere la mejor técnica (Pomodoro, práctica activa o Feynman) según si es teoría nueva o repaso.",
    },
    {
      num: "03",
      tag: "Enfócate",
      title: "Entra en sesión sin distracciones",
      desc: "Inicia el temporizador y deja que el sistema marque el ritmo con objetivos claros por bloque.",
    },
  ];

  const flowNodes = [
    { label: "Materia", sub: "Cálculo Diferencial" },
    { label: "Tema", sub: "Límites" },
    { label: "Contexto", sub: "Preparación Parcial" },
    { label: "Método", sub: "Pomodoro + Práctica" },
    { label: "Sesión", sub: "25 min de enfoque" },
  ];

  return (
    <section id="como-funciona" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 sm:space-y-12">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Flujo de trabajo
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          De la materia al enfoque en segundos.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Diseñado para eliminar toda la fricción entre tener que estudiar y realmente concentrarte.
        </p>
      </div>

      {/* 3 Pasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-6 sm:p-7 rounded-[22px] bg-white/80 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-glacier-blue bg-glacier-blue/10 px-2.5 py-0.5 rounded-full">
                {s.num}
              </span>
              <span className="text-[11px] font-semibold text-arctic-tertiary uppercase tracking-wider">
                {s.tag}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-arctic-slate tracking-tight">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-arctic-secondary leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Flujo Visual: [Materia] → [Tema] → [Contexto] → [Método] → [Sesión] */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-arctic-tertiary">
            La secuencia mental de studia+
          </span>
        </div>

        <div className="p-4 sm:p-6 rounded-[22px] bg-white/80 border border-black/[0.06] shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {flowNodes.map((node, idx) => (
              <div key={node.label} className="flex items-center flex-1">
                <div className="flex-1 p-3 rounded-xl bg-frost-base border border-black/[0.04] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-arctic-tertiary block">
                    {node.label}
                  </span>
                  <span className="text-xs font-semibold text-arctic-slate truncate block mt-0.5">
                    {node.sub}
                  </span>
                </div>
                {idx < flowNodes.length - 1 && (
                  <ArrowRight size={14} className="text-arctic-tertiary/40 mx-2 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demostración Visual: "Tu siguiente sesión, ya pensada" */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-arctic-slate">
            Tu siguiente sesión, ya pensada.
          </h3>
          <p className="text-xs sm:text-sm text-arctic-secondary">
            Configurada con anticipación para que solo tengas que sentarte y presionar un botón.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="rounded-[24px] bg-white border border-black/[0.08] shadow-[0_16px_40px_-10px_rgba(0,25,60,0.06)] p-6 sm:p-8 space-y-5 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <span className="text-xs font-semibold text-arctic-tertiary uppercase tracking-wider">
                Preparación de Sesión
              </span>
              <span className="text-xs font-semibold text-glacier-blue">
                studia+ copiloto
              </span>
            </div>

            {/* Campos de la UI real */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-baseline justify-between py-1 border-b border-black/[0.04]">
                <span className="font-medium text-arctic-secondary">Materia</span>
                <span className="font-bold text-arctic-slate text-sm">Cálculo Diferencial</span>
              </div>

              <div className="flex items-baseline justify-between py-1 border-b border-black/[0.04]">
                <span className="font-medium text-arctic-secondary">Tema actual</span>
                <span className="font-semibold text-arctic-slate">Límites e indeterminaciones 0/0</span>
              </div>

              <div className="flex items-baseline justify-between py-1 border-b border-black/[0.04]">
                <span className="font-medium text-arctic-secondary">Contexto</span>
                <span className="font-medium text-arctic-slate bg-frost-base px-2 py-0.5 rounded-md">
                  Preparación para parcial (en 12 días)
                </span>
              </div>

              <div className="flex items-start justify-between py-1 border-b border-black/[0.04]">
                <span className="font-medium text-arctic-secondary">Método recomendado</span>
                <div className="text-right">
                  <span className="font-bold text-glacier-blue block">Técnica Pomodoro</span>
                  <span className="text-[11px] text-arctic-tertiary">+ práctica activa de ejercicios</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between py-1">
                <span className="font-medium text-arctic-secondary">Duración del bloque</span>
                <span className="font-mono font-bold text-arctic-slate text-sm">25 min</span>
              </div>
            </div>

            {/* Botón Comenzar */}
            <div className="pt-2">
              <Link
                href="/registro"
                className="w-full btn-apple-primary py-3 px-6 rounded-xl font-semibold text-xs apple-tactile inline-flex items-center justify-center gap-2 shadow-apple-sm"
              >
                <Play size={14} fill="currentColor" />
                <span>Comenzar sesión de estudio</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
