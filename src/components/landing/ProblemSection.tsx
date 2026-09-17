export default function ProblemSection() {
  const problems = [
    {
      num: "01",
      title: "No sé por dónde empezar.",
      desc: "Entre programas extensos, diapositivas y lecturas dispersas, la mitad de tu energía mental se agota decidiendo qué tema abrir.",
    },
    {
      num: "02",
      title: "Estudio mucho, pero no sé si estoy estudiando bien.",
      desc: "Leer pasivamente durante horas da la sensación de avanzar, pero no garantiza dominar los conceptos frente al parcial.",
    },
    {
      num: "03",
      title: "Empiezo una sesión y termino distrayéndome.",
      desc: "Sin un objetivo granular y un límite de tiempo definido, cualquier notificación interrumpe la concentración.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">
      {/* Título de la sección */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-arctic-tertiary">
          El dilema universitario
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate leading-snug">
          Estudiar no debería empezar por decidir qué hacer.
        </h2>
      </div>

      {/* Los 3 problemas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
        {problems.map((p) => (
          <div
            key={p.num}
            className="p-6 sm:p-7 rounded-[22px] bg-white/70 backdrop-blur-md border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6"
          >
            <span className="text-sm font-mono font-bold text-arctic-tertiary/70">
              {p.num}
            </span>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-arctic-slate tracking-tight">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-arctic-secondary leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Frase puente de resolución */}
      <div className="pt-4 max-w-2xl mx-auto">
        <p className="text-base sm:text-lg font-medium text-arctic-slate tracking-tight">
          studia+ convierte ese caos en un{" "}
          <span className="text-glacier-blue font-semibold">
            siguiente paso claro
          </span>
          .
        </p>
      </div>
    </section>
  );
}
