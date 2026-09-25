import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen, CalendarClock } from "lucide-react";
import type { SiguientePaso } from "@/lib/siguientePaso";
import CreateMateriaForm from "@/components/CreateMateriaForm";

/**
 * «Hoy»: la respuesta a qué estudio ahora. Reúne el siguiente tema, por qué es ese y, si hay un
 * parcial cerca, el avance hacia él (antes eran dos tarjetas separadas más un pulso en bucle).
 */
export default function TarjetaHoy({ paso, sinMaterias }: { paso: SiguientePaso | null; sinMaterias: boolean }) {
  if (!paso) {
    return (
      <section aria-labelledby="hoy-titulo" className="apple-card p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full">
        <div aria-hidden="true" className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-arctic-secondary mb-3">
          <BookOpen size={22} />
        </div>
        <h2 id="hoy-titulo" className="apple-title-3 text-arctic-slate">
          {sinMaterias ? "Crea tu primera materia" : "Sin temas pendientes"}
        </h2>
        <p className="text-sm text-arctic-secondary max-w-sm mt-1 mb-5">
          {sinMaterias
            ? "Agrega una asignatura (con la fecha de tu parcial, si ya la sabes) y después sus temas. studia+ te dirá qué estudiar primero."
            : "Completaste los temas de tus materias. Agrega temas nuevos o crea otra materia."}
        </p>
        <CreateMateriaForm />
      </section>
    );
  }

  const plan = paso.plan && paso.plan.temasTotales > 0 ? paso.plan : null;
  const avance = plan ? Math.round(((plan.temasTotales - plan.temasPendientes) / plan.temasTotales) * 100) : 0;

  return (
    <section aria-labelledby="hoy-titulo" className="apple-card p-6 sm:p-8 flex flex-col justify-between gap-6 h-full">
      <div>
        <p className="text-xs font-semibold tracking-wide text-glacier-blue">Para hoy</p>
        <h2 id="hoy-titulo" className="apple-title-2 text-arctic-slate mt-2 break-words">
          {paso.temaNombre}
        </h2>
        <p className="text-sm text-arctic-secondary mt-1">{paso.materiaNombre}</p>
        <p className="inline-flex items-center gap-1.5 text-sm text-arctic-slate mt-3">
          {plan && <CalendarClock size={15} className="text-glacier-blue shrink-0" aria-hidden="true" />}
          <span>{paso.motivo}</span>
        </p>

        {plan && (
          <div className="mt-4 max-w-md">
            <div className="flex justify-between text-xs text-arctic-secondary mb-1.5">
              <span>
                {plan.temasTotales - plan.temasPendientes} de {plan.temasTotales} temas para el parcial
              </span>
              <span className="tabular-nums">{avance}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Temas completados para el parcial"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={avance}
              className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden"
            >
              <div className="h-full rounded-full bg-glacier-blue" style={{ width: `${avance}%` }} />
            </div>
            {plan.temasPorDia > 0 && (
              <p className="text-xs text-arctic-secondary mt-2">
                Ritmo sugerido: {plan.temasPorDia === 1 ? "1 tema por día" : `unos ${plan.temasPorDia} temas por día`} y el día
                anterior para repasar.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <Link
          href={`/sesion/nueva?materia=${paso.materiaId}&tema=${paso.temaId}`}
          className="btn-apple-primary text-sm min-h-11 px-6 apple-tactile justify-center"
        >
          <span>Empezar a estudiar</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link href={`/materias/${paso.materiaId}`} className="btn-apple-secondary text-sm min-h-11 px-4 apple-tactile justify-center">
          <span>Ver temario</span>
          <ChevronRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
