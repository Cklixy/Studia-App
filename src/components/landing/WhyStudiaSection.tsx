import { Compass, Sliders, Target, Eye } from "lucide-react";

export default function WhyStudiaSection() {
  const benefits = [
    {
      icon: Compass,
      title: "Menos tiempo decidiendo",
      desc: "Siempre tienes un siguiente paso claro sin perder 20 minutos decidiendo qué carpeta o diapositiva abrir.",
    },
    {
      icon: Sliders,
      title: "Estudio adaptado",
      desc: "El método cambia según tu objetivo: aprender teoría nueva, resolver problemas prácticos o repasar para un examen.",
    },
    {
      icon: Target,
      title: "Sesiones con intención",
      desc: "Cada sesión cuenta con un tema acotado, una duración definida y un objetivo claro antes de presionar el temporizador.",
    },
    {
      icon: Eye,
      title: "Tu progreso, visible",
      desc: "Registra cuánto tiempo has invertido en cada materia y cómo vas cubriendo el temario antes de llegar al parcial.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 sm:space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-glacier-blue">
          Beneficios concretos
        </span>
        <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
          Por qué estudiar con studia+
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Sin trucos ni promesas vacías: una herramienta construida para darte estructura y foco real.
        </p>
      </div>

      {/* Grid de Beneficios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="p-6 sm:p-7 rounded-3xl bg-white/80 border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4 text-left flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <b.icon size={19} strokeWidth={2} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-arctic-slate tracking-tight">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-arctic-secondary leading-relaxed">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
