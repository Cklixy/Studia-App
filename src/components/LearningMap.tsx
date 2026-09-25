import { CheckCircle2, Clock, Play } from "lucide-react";
import Link from "next/link";
import LearningMapItemActions from "./LearningMapItemActions";

interface TemaData {
  id: string;
  nombre: string;
  estado: string;
  descripcion?: string | null;
  dificultad?: string | null;
  minutos_estimados?: number | null;
  orden?: number | null;
  created_at?: string;
}

interface RouteData {
  id?: string;
  title?: string;
  estado?: string;
}

interface LearningMapProps {
  temas: TemaData[];
  route?: RouteData | null;
}

/**
 * Server Component puro: no tiene 'use client'.
 * Renderiza el árbol curricular, progreso porcentual, cronología de nodos y metadatos
 * directamente como HTML en el servidor sin sobrecargar el bundle de JavaScript.
 * Las acciones interactivas se delegan a LearningMapItemActions.
 */
export default function LearningMap({ temas, route }: LearningMapProps) {
  // Determinar el tema actual (el primero que no está completado)
  const actualIndex = temas.findIndex((t) => t.estado !== "completado");
  const completedCount = temas.filter((t) => t.estado === "completado").length;
  const progressPct = temas.length > 0 ? Math.round((completedCount / temas.length) * 100) : 0;
  const materiaTitulo = route?.title || "Plan de Aprendizaje";

  return (
    <div className="tarjeta p-6 md:p-8 rounded-3xl mb-12 shadow-2">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-linea">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-acento/10 text-acento text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 bg-acento rounded-full animate-pulse" />
            <span>Ruta Curricular</span>
          </div>
          <h3 className="titulo-2 text-tinta">
            {materiaTitulo}
          </h3>
        </div>

        <div className="sm:text-right">
          <div className="text-xs uppercase tracking-wider text-tinta-2 font-semibold mb-1">
            Progreso de Dominio
          </div>
          <div className="flex items-baseline gap-2 sm:justify-end">
            <span className="font-mono text-2xl font-bold text-tinta tabular-nums">
              {completedCount}
            </span>
            <span className="text-tinta-2 text-sm">/ {temas.length} temas</span>
            <span className="text-xs font-semibold text-acento ml-1">({progressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Connected Milestone Timeline */}
      <div className="relative border-l-2 border-linea ml-3 md:ml-4 space-y-7">
        {temas.map((tema, index) => {
          const isCompleted = tema.estado === "completado";
          const isActual = index === actualIndex;
          const isPending = index > actualIndex && actualIndex !== -1;

          return (
            <div 
              key={tema.id} 
              className={`relative pl-7 md:pl-9 transition-all duration-200 ${
                isPending ? "opacity-55 hover:opacity-80" : ""
              }`}
            >
              {/* Apple Node Icon (Puro CSS y SVG estático) */}
              <div 
                className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? "bg-acento border-2 border-acento text-sobre-acento shadow-1" 
                    : isActual 
                    ? "bg-superficie border-2 border-acento shadow-2" 
                    : "bg-superficie border-2 border-linea-fuerte"
                }`}
              >
                {isCompleted && <CheckCircle2 size={12} strokeWidth={2} />}
                {isActual && <div className="w-2 h-2 bg-acento rounded-full animate-pulse" />}
              </div>

              {/* Theme Content */}
              <div className="flex flex-col lg:flex-row justify-between gap-4 items-start p-4 rounded-2xl bg-fondo/50 border border-linea hover:bg-superficie hover:border-linea hover:shadow-1 transition-all">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className={`encabezado ${
                      isCompleted ? "line-through text-tinta-3" : "text-tinta"
                    }`}>
                      {tema.nombre}
                    </h4>
                    {tema.dificultad && (
                      <span className={`text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        isActual 
                          ? "bg-acento/10 text-acento border border-acento/20" 
                          : "bg-hundido text-tinta-2"
                      }`}>
                        {tema.dificultad}
                      </span>
                    )}
                  </div>

                  {tema.descripcion && (
                    <p className="subtitulo text-xs text-tinta-2 mb-3 leading-relaxed max-w-xl">
                      {tema.descripcion}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-tinta-2">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} strokeWidth={2} /> {tema.minutos_estimados || 30} min
                    </span>
                    {/* Botón interactivo de toggle estado */}
                    <LearningMapItemActions
                      tema={tema}
                      materiaNombre={materiaTitulo}
                      isActual={false}
                    />
                  </div>
                </div>

                {isActual && (
                  <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto pt-2 sm:pt-0">
                    <Link 
                      href={`/sesion/iniciar/${tema.id}`}
                      className="btn-primario text-xs py-2 px-4 font-semibold tactil shadow-1 flex-1 sm:flex-initial text-center justify-center inline-flex items-center gap-1.5"
                    >
                      <Play size={13} strokeWidth={2} />
                      <span>Estudiar tema</span>
                    </Link>
                    {/* Botón interactivo de duda rápida */}
                    <LearningMapItemActions
                      tema={tema}
                      materiaNombre={materiaTitulo}
                      isActual={true}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
