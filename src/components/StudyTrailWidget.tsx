import { Flame } from "lucide-react";

interface StudyTrailWidgetProps {
  dias?: number;
}

/**
 * Server Component puro: no incluye 'use client'.
 * No envía JavaScript al cliente ni ejecuta hooks o llamadas de red en el navegador.
 * Recibe los días de racha calculados en el servidor y renderiza HTML estático.
 */
export default function StudyTrailWidget({ dias = 0 }: StudyTrailWidgetProps) {
  if (dias === 0) return null; // Si no hay racha, mantenemos la interfaz limpia

  return (
    <section className="space-y-2.5 duration-500">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-semibold text-tinta-3 uppercase tracking-wider">
          Tu Recorrido de Enfoque
        </span>
      </div>
      <div className="tarjeta p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-acento/10 text-acento flex items-center justify-center shrink-0">
            <Flame size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-tinta tracking-tight">
              Has mantenido el ritmo por <span className="font-display font-bold text-acento mx-0.5">{dias}</span> {dias === 1 ? "día consecutivo" : "días consecutivos"}.
            </p>
            <p className="text-xs text-tinta-2 mt-0.5">La constancia diaria construye la ruta más directa hacia tus metas.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Visualización conceptual de barras de constancia */}
          {[...Array(Math.min(dias, 7))].map((_, i) => (
            <div key={i} className="w-2.5 h-10 rounded-full bg-hundido flex flex-col justify-end overflow-hidden p-0.5">
              <div
                className="w-full bg-acento rounded-full"
                style={{
                  height: `${Math.min(100, ((i + 1) / Math.min(dias, 7)) * 100)}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
