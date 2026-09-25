import Link from "next/link";
import { CalendarClock, ArrowRight } from "lucide-react";
import type { PlanParcial } from "@/lib/planParcial";

// Tarjeta «Plan hasta el parcial»: días restantes, ritmo sugerido y siguiente tema.
export default function TarjetaPlanParcial({ plan, mostrarMateria = true }: { plan: PlanParcial; mostrarMateria?: boolean }) {
  const urgente = plan.diasRestantes <= 3;
  const fecha = new Date(`${plan.fechaParcial}T12:00:00Z`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const avance = plan.temasTotales ? Math.round(((plan.temasTotales - plan.temasPendientes) / plan.temasTotales) * 100) : 0;

  return (
    <section
      aria-label={`Plan hasta el parcial de ${plan.materiaNombre}`}
      className={`apple-card p-5 sm:p-6 border ${urgente ? "border-cool-berry/30" : "border-glacier-blue/20"}`}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${urgente ? "bg-cool-berry/10 text-cool-berry" : "bg-glacier-blue/10 text-glacier-blue"}`}
        >
          <CalendarClock size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="tracking-wide text-xs font-semibold text-arctic-secondary">Plan hasta el parcial</p>
          <h2 className="text-base sm:text-lg font-bold text-arctic-slate mt-0.5">
            {mostrarMateria ? `${plan.materiaNombre} · ` : ""}
            <span className="font-semibold">{fecha}</span>
          </h2>
          <p className="text-sm text-arctic-slate mt-1.5">{plan.mensaje}</p>

          {plan.temasTotales > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-arctic-secondary mb-1">
                <span>
                  {plan.temasTotales - plan.temasPendientes} de {plan.temasTotales} temas completados
                </span>
                <span>{avance}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Temas completados"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={avance}
                className="h-2 rounded-full bg-black/[0.06] overflow-hidden"
              >
                <div className="h-full rounded-full bg-glacier-blue" style={{ width: `${avance}%` }} />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {plan.siguienteTema ? (
              <Link
                href={`/sesion/nueva?materia=${plan.materiaId}&tema=${plan.siguienteTema.id}`}
                className="btn-apple-primary text-sm min-h-11 px-4 inline-flex items-center gap-2"
              >
                <span>Estudiar «{plan.siguienteTema.nombre}»</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ) : (
              <Link href={`/materias/${plan.materiaId}`} className="btn-apple-secondary text-sm min-h-11 px-4 inline-flex items-center">
                {plan.temasTotales === 0 ? "Agregar temas" : "Ver la materia"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
