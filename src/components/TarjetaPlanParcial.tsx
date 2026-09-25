import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PlanParcial } from "@/lib/planParcial";
import BarraProgreso from "@/components/ui/BarraProgreso";

// Tarjeta «Plan hasta el parcial»: cuenta atrás, ritmo sugerido y avance. Es un enlace secundario:
// la acción principal («Empezar sesión») vive en la tarjeta del siguiente paso.
export default function TarjetaPlanParcial({
  plan,
  mostrarMateria = true,
  nivel = "h3",
  enlace = true,
}: {
  plan: PlanParcial;
  mostrarMateria?: boolean;
  nivel?: "h2" | "h3";
  /** false cuando la pantalla ya ofrece «Estudiar» como acción principal (evita duplicarla) */
  enlace?: boolean;
}) {
  const Titulo = nivel;
  const urgente = plan.diasRestantes <= 3;
  const fecha = new Date(`${plan.fechaParcial}T12:00:00Z`).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const hechos = plan.temasTotales - plan.temasPendientes;
  const avance = plan.temasTotales ? Math.round((hechos / plan.temasTotales) * 100) : 0;
  const destino = plan.siguienteTema
    ? `/sesion/nueva?materia=${plan.materiaId}&tema=${plan.siguienteTema.id}`
    : `/materias/${plan.materiaId}`;

  return (
    <section aria-label={`Plan hasta el parcial de ${plan.materiaNombre}`} className="tarjeta p-4 sm:p-5">
      <div className="flex gap-4">
        <div className={`shrink-0 w-16 text-center border-r pr-4 ${urgente ? "border-aviso/40" : "border-linea"}`}>
          <span className={`block font-display text-4xl leading-none ${urgente ? "text-aviso" : "text-tinta"}`}>
            {plan.diasRestantes}
          </span>
          <span className="block text-xs font-semibold text-tinta-2 mt-1">
            {plan.diasRestantes === 1 ? "día" : "días"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <Titulo className="encabezado">
            {mostrarMateria ? plan.materiaNombre : "Plan hasta el parcial"}
          </Titulo>
          <p className="text-sm text-tinta-2 first-letter:uppercase">{fecha}</p>
          {plan.temasTotales > 0 && (
            <div className="mt-2.5 flex items-center gap-3">
              <BarraProgreso
                valor={avance}
                etiqueta={`Temas listos de ${plan.materiaNombre}`}
                textoValor={`${hechos} de ${plan.temasTotales} temas`}
                tono="exito"
                className="flex-1"
              />
              <span className="text-xs font-semibold text-tinta-2 tabular-nums">
                {hechos}/{plan.temasTotales}
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-tinta mt-3">{plan.mensaje}</p>
      {enlace && (
      <Link href={destino} className="mt-2 -mb-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-acento">
        {plan.siguienteTema ? `Estudiar «${plan.siguienteTema.nombre}»` : plan.temasTotales === 0 ? "Agregar temas" : "Ver la materia"}
        <ChevronRight aria-hidden="true" size={16} />
      </Link>
      )}
    </section>
  );
}
