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
    <div className="apple-card p-6 md:p-8 rounded-3xl mb-12 border border-black/[0.08] shadow-apple-md bg-white/95">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8 pb-6 border-b border-black/[0.06]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-glacier-blue/10 text-glacier-blue text-[11px] font-semibold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 bg-glacier-blue rounded-full animate-pulse" />
            <span>Ruta Curricular</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-arctic-slate">
            {materiaTitulo}
          </h3>
        </div>

        <div className="sm:text-right">
          <div className="text-[11px] uppercase tracking-wider text-arctic-secondary font-semibold mb-1">
            Progreso de Dominio
          </div>
          <div className="flex items-baseline gap-2 sm:justify-end">
            <span className="font-mono text-2xl font-bold text-arctic-slate tabular-nums">
              {completedCount}
            </span>
            <span className="text-arctic-secondary text-sm">/ {temas.length} temas</span>
            <span className="text-xs font-semibold text-glacier-blue ml-1">({progressPct}%)</span>
          </div>
        </div>
      </div>

      {/* Connected Milestone Timeline */}
      <div className="relative border-l-2 border-black/[0.08] ml-3 md:ml-4 space-y-7">
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
                    ? "bg-glacier-blue border-2 border-glacier-blue text-white shadow-apple-sm" 
                    : isActual 
                    ? "bg-white border-2 border-glacier-blue shadow-apple-glow" 
                    : "bg-white border-2 border-black/20"
                }`}
              >
                {isCompleted && <CheckCircle2 size={12} className="stroke-[3]" />}
                {isActual && <div className="w-2 h-2 bg-glacier-blue rounded-full animate-pulse" />}
              </div>

              {/* Theme Content */}
              <div className="flex flex-col lg:flex-row justify-between gap-4 items-start p-4 rounded-2xl bg-frost-base/50 border border-black/[0.06] hover:bg-white hover:border-black/[0.1] hover:shadow-apple-sm transition-all">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <h4 className={`text-base font-semibold tracking-tight ${
                      isCompleted ? "line-through text-arctic-tertiary" : "text-arctic-slate"
                    }`}>
                      {tema.nombre}
                    </h4>
                    {tema.dificultad && (
                      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        isActual 
                          ? "bg-glacier-blue/10 text-glacier-blue border border-glacier-blue/20" 
                          : "bg-black/[0.05] text-arctic-secondary"
                      }`}>
                        {tema.dificultad}
                      </span>
                    )}
                  </div>

                  {tema.descripcion && (
                    <p className="text-xs text-arctic-secondary mb-3 leading-relaxed max-w-xl">
                      {tema.descripcion}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-arctic-secondary">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} /> {tema.minutos_estimados || 30} min
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
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Link 
                      href={`/sesion/iniciar/${tema.id}`}
                      className="btn-apple-primary text-xs py-2 px-4.5 font-semibold apple-tactile shadow-apple-sm"
                    >
                      <Play size={13} fill="currentColor" />
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
