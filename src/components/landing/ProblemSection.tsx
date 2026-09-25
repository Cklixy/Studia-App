export default function ProblemSection() {
  const problems = [
    {
      title: "Demasiado contenido",
      desc: "Tienes apuntes, tareas, parciales y temas pendientes, pero no sabes qué priorizar.",
    },
    {
      title: "No sabes cómo estudiarlo",
      desc: "Leer y releer no siempre significa aprender.",
    },
    {
      title: "Falta de enfoque",
      desc: "Empiezas una sesión y terminas saltando entre tareas, aplicaciones y distracciones.",
    },
  ];

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto text-center space-y-8 sm:space-y-10 w-full">
      {/* Título */}
      <div className="space-y-2 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-tinta leading-tight">
          Tu problema no es estudiar. Es saber por dónde empezar.
        </h2>
      </div>

      {/* Los 3 problemas en grid amplio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-left">
        {problems.map((p) => (
          <div
            key={p.title}
            className="p-4 sm:p-6 rounded-3xl bg-superficie border border-linea shadow-2 space-y-2"
          >
            <h3 className="text-sm sm:text-base font-bold text-tinta tracking-tight">
              {p.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-tinta-2 leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Cierre */}
      <div className="pt-1">
        <p className="text-sm sm:text-base font-medium text-tinta">
          studia+ convierte todo eso en un{" "}
          <span className="text-acento font-semibold">
            siguiente paso claro
          </span>
          .
        </p>
      </div>
    </section>
  );
}
