import { SubjectIconContainer } from "@/lib/subject-icons";
import { Flame, Clock, Target, Star, BookOpen, Layers } from "lucide-react";

export default function ProgressSection() {
  const exampleSessions = [
    {
      materia: "Cálculo Diferencial",
      tema: "Límites algebraicos e indeterminaciones 0/0",
      fecha: "Hoy · 17:23",
      metodo: "Active Recall + Ejercicios de examen",
      duracion: "1 h 22 min",
      rating: "4.8",
    },
    {
      materia: "Programación Orientada a Objetos",
      tema: "Polimorfismo, interfaces y patrones en TypeScript",
      fecha: "Ayer · 18:24",
      metodo: "Técnica Pomodoro + Práctica de código",
      duracion: "1 h 13 min",
      rating: "5.0",
    },
    {
      materia: "Arquitectura de Computadores",
      tema: "Álgebra de Boole, compuertas lógicas y mapas de Karnaugh",
      fecha: "15 sep · 16:45",
      metodo: "Práctica Deliberada + Diagramas",
      duracion: "55 min",
      rating: "4.7",
    },
  ];

  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full space-y-10">
      
      {/* Encabezado */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-glacier-blue">
          Tu progreso también cuenta
        </span>
        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-arctic-slate">
          Todo lo que estudias deja huella.
        </h2>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Visualiza cada bloque de estudio, los métodos empleados y cómo se acumula tu constancia semana a semana.
        </p>
      </div>

      <div className="space-y-6 w-full">
        
        {/* Grid de 4 Estadísticas a Ancho Completo */}
        <div className="bg-white border border-black/[0.08] rounded-[26px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.06] overflow-hidden text-left">
          
          <div className="p-6 sm:p-7 flex flex-col justify-between gap-2">
            <span className="text-xs font-semibold text-arctic-secondary">Sesiones registradas</span>
            <div className="my-1">
              <span className="text-3xl sm:text-4xl font-bold text-arctic-slate font-mono tabular-nums">
                04
              </span>
            </div>
            <span className="text-[11px] text-arctic-tertiary">En la última semana</span>
          </div>

          <div className="p-6 sm:p-7 flex flex-col justify-between gap-2">
            <span className="text-xs font-semibold text-arctic-secondary">Tiempo de enfoque</span>
            <div className="my-1">
              <span className="text-3xl sm:text-4xl font-bold text-arctic-slate tabular-nums">
                02h 35m
              </span>
            </div>
            <span className="text-[11px] text-arctic-tertiary">Tiempo efectivo de estudio</span>
          </div>

          <div className="p-6 sm:p-7 flex flex-col justify-between gap-2">
            <span className="text-xs font-semibold text-arctic-secondary">Objetivos cumplidos</span>
            <div className="my-1">
              <span className="text-3xl sm:text-4xl font-bold text-arctic-slate tabular-nums">
                87%
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Metas completadas</span>
          </div>

          <div className="p-6 sm:p-7 flex flex-col justify-between gap-2">
            <span className="text-xs font-semibold text-arctic-secondary">Hábito y constancia</span>
            <div className="my-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-arctic-slate tabular-nums flex items-center gap-1.5">
                <Flame size={26} className="text-amber-500 fill-amber-500" />
                12d
              </span>
            </div>
            <span className="text-[11px] text-glacier-blue font-semibold">+120 XP acumulados</span>
          </div>

        </div>

        {/* Historial de Sesiones a Ancho Completo (Exactamente el sistema visual de /historial) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-bold text-arctic-slate uppercase tracking-wider">
              Historial de sesiones recientes
            </span>
            <span className="text-arctic-tertiary font-medium">
              Demostración del registro real
            </span>
          </div>

          <div className="space-y-3">
            {exampleSessions.map((s) => (
              <div
                key={s.tema}
                className="bg-white border border-black/[0.06] hover:border-glacier-blue/30 rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-[0_8px_24px_rgba(0,25,60,0.04)] transition-all text-left"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <SubjectIconContainer subjectName={s.materia} size="md" className="mt-0.5" />

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-base font-bold text-arctic-slate truncate">
                      {s.materia}
                    </h4>
                    <p className="text-xs sm:text-sm text-arctic-secondary truncate">
                      {s.tema}
                    </p>
                    <div className="flex items-center gap-2.5 pt-0.5 text-[11px] text-arctic-tertiary">
                      <span>{s.fecha}</span>
                      <span className="opacity-40">•</span>
                      <span className="text-arctic-secondary font-medium">{s.metodo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.04]">
                  <span className="text-base font-bold text-arctic-slate font-mono tabular-nums">
                    {s.duracion}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600/90 sm:mt-0.5">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{s.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
