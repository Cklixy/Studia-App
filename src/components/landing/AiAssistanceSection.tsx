import { Split, GitFork, Lightbulb, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export default function AiAssistanceSection() {
  const capabilities = [
    {
      icon: Split,
      title: "Desglose de temarios densos",
      desc: "Convierte el programa oficial de tu materia en bloques pequeños con metas realizables por día.",
    },
    {
      icon: GitFork,
      title: "Orden por prerrequisitos",
      desc: "Organiza los subtemas para que domines los fundamentos antes de enfrentarte a los conceptos avanzados.",
    },
    {
      icon: Lightbulb,
      title: "Recomendación de métodos",
      desc: "Sugiere la mejor técnica según si estás aprendiendo teoría abstracta, resolviendo problemas o repasando.",
    },
    {
      icon: MessageSquareQuote,
      title: "Explicaciones y analogías",
      desc: "Cuando un concepto no queda claro, el tutor integrado te lo explica paso a paso con ejemplos intuitivos.",
    },
  ];

  return (
    <section id="ia" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Asistencia con propósito
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          IA que te ayuda a estudiar, no que estudia por ti.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          studia+ utiliza inteligencia artificial como un copiloto de organización y claridad, no para hacer trampas.
        </p>
      </div>

      {/* Grid de Capacidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className="p-7 rounded-[24px] bg-white/80 border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4 text-left"
          >
            <div className="w-11 h-11 rounded-[14px] bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <cap.icon size={20} strokeWidth={2} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-arctic-slate tracking-tight">
              {cap.title}
            </h3>
            <p className="text-xs sm:text-sm text-arctic-secondary leading-relaxed">
              {cap.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Ejemplo visual del tutor */}
      <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-[22px] bg-white/90 border border-black/[0.06] shadow-sm text-left flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-cool-iris/10 text-cool-iris flex items-center justify-center shrink-0 font-bold text-xs">
          AI
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <span className="font-semibold text-arctic-slate block">
            Ejemplo de consulta en Cálculo Diferencial:
          </span>
          <p className="text-arctic-secondary leading-relaxed italic">
            &ldquo;¿Por qué un límite puede existir aunque la función no esté definida en ese punto?&rdquo;
          </p>
          <p className="text-arctic-slate pt-1 leading-relaxed">
            → &ldquo;El límite describe hacia dónde se dirige el camino cuando te acercas, no lo que hay exactamente en el punto. Si dos personas caminan hacia el mismo puente desde lados opuestos, ambas apuntan al mismo destino, incluso si hay un pequeño hueco en medio.&rdquo;
          </p>
        </div>
      </div>

    </section>
  );
}
