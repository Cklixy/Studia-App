import { Flame } from "lucide-react";
import { xpInicioNivel } from "@/lib/racha";
import { plural } from "@/lib/texto";
import MetaSemanal from "./MetaSemanal";

interface TarjetaSemanaProps {
  racha: number;
  minutosSemana: number;
  metaMinutos: number | null;
  nivel: number;
  xpTotal: number;
}

function formatoHoras(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/**
 * Tu semana: racha, avance hacia la meta semanal y nivel. El anillo mide la meta (antes medía
 * «XP de la semana % 500», que no correspondía a nada que el usuario pudiera entender).
 */
export default function TarjetaSemana({ racha, minutosSemana, metaMinutos, nivel, xpTotal }: TarjetaSemanaProps) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const ratio = metaMinutos ? Math.min(1, minutosSemana / metaMinutos) : 0;
  const xpNivel = xpInicioNivel(nivel);
  const xpSiguiente = xpInicioNivel(nivel + 1);
  const avanceNivel = Math.round(((xpTotal - xpNivel) / (xpSiguiente - xpNivel)) * 100);

  return (
    <section aria-labelledby="semana-titulo" className="apple-card p-6 flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between gap-3">
        <h2 id="semana-titulo" className="apple-headline text-arctic-slate">Tu semana</h2>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-arctic-slate">
          <Flame size={15} className={racha > 0 ? "text-cool-berry fill-cool-berry" : "text-arctic-tertiary"} aria-hidden="true" />
          <span>{racha > 0 ? plural(racha, "día de racha", "días de racha") : "Sin racha"}</span>
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle cx="50" cy="50" r={R} className="stroke-black/[0.06]" strokeWidth="9" fill="none" />
            {/* Sin avance no se dibuja el arco: el extremo redondeado dejaría un punto suelto */}
            {metaMinutos && ratio > 0 ? (
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="#0066CC"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - ratio)}
              />
            ) : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tracking-tight text-arctic-slate tabular-nums">
              {metaMinutos ? `${Math.round(ratio * 100)}%` : formatoHoras(minutosSemana)}
            </span>
            <span className="text-xs text-arctic-secondary">{metaMinutos ? "de la meta" : "esta semana"}</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-arctic-slate">
            {metaMinutos ? (
              <>
                <strong className="font-semibold">{formatoHoras(minutosSemana)}</strong> de {formatoHoras(metaMinutos)} esta semana
              </>
            ) : (
              "Fija una meta para ver tu avance semanal."
            )}
          </p>
          {metaMinutos && minutosSemana >= metaMinutos && (
            <p className="text-sm text-emerald-700 font-medium mt-1">¡Meta cumplida!</p>
          )}
          <MetaSemanal meta={metaMinutos} />
        </div>
      </div>

      <div className="pt-4 border-t border-black/[0.06]">
        <div className="flex justify-between text-xs text-arctic-secondary mb-1.5">
          <span>
            <strong className="font-semibold text-arctic-slate">Nivel {nivel}</strong> · {xpTotal - xpNivel} de {xpSiguiente - xpNivel} XP para el
            nivel {nivel + 1}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={`Progreso al nivel ${nivel + 1}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={avanceNivel}
          className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden"
        >
          <div className="h-full rounded-full bg-cool-iris" style={{ width: `${avanceNivel}%` }} />
        </div>
      </div>
    </section>
  );
}
