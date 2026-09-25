import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CalendarPlus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import EvaluacionesGlobal from "@/components/EvaluacionesGlobal";
import TarjetaPlanParcial from "@/components/TarjetaPlanParcial";
import EstadoVacio from "@/components/ui/EstadoVacio";
import CreateMateriaForm from "@/components/CreateMateriaForm";
import { getCachedMaterias } from "@/lib/data/materias";
import { planesProximos, type PlanParcial } from "@/lib/planParcial";

export const metadata: Metadata = { title: "Parciales · studia+" };

// Parciales (rediseño 4.5): priorización visible (el más cercano primero, agrupado por urgencia),
// materias a las que les falta la fecha y, debajo, las notas. Antes la página se llamaba «Evaluaciones»
// y el dock «Parciales»; ahora coinciden.
export default async function ParcialesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: { session } } = await supabase.auth.getSession();

  const materias = (await getCachedMaterias(user.id, session?.access_token)) || [];
  const planes = planesProximos(materias as any, 365);
  const sinFecha = materias.filter((m: any) => !m.fecha_parcial);

  const grupos: { titulo: string; planes: PlanParcial[] }[] = [
    { titulo: "Esta semana", planes: planes.filter((p) => p.diasRestantes <= 7) },
    { titulo: "Pronto", planes: planes.filter((p) => p.diasRestantes > 7 && p.diasRestantes <= 21) },
    { titulo: "Más adelante", planes: planes.filter((p) => p.diasRestantes > 21) },
  ].filter((g) => g.planes.length);

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="titulo-1">Parciales</h1>
        <p className="subtitulo mt-1.5">
          {planes.length
            ? `El más cercano es ${planes[0].materiaNombre}: ${planes[0].diasRestantes === 0 ? "hoy" : planes[0].diasRestantes === 1 ? "mañana" : `en ${planes[0].diasRestantes} días`}.`
            : "Tus fechas de parcial y tus notas, en un solo lugar."}
        </p>
      </header>

      {materias.length === 0 ? (
        <EstadoVacio
          icono={CalendarDays}
          titulo="Aún no hay parciales"
          texto="Crea una materia con la fecha de su parcial y aquí verás cuántos días faltan, tu plan y tus notas."
          accion={<CreateMateriaForm variante="primario" />}
        />
      ) : (
        <>
          <section aria-labelledby="titulo-proximos" className="flex flex-col gap-6">
            <h2 id="titulo-proximos" className="sr-only">Próximos parciales</h2>
            {grupos.map((g) => (
              <div key={g.titulo} className="flex flex-col gap-3">
                <h3 className="antetitulo">{g.titulo}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {g.planes.map((plan) => <TarjetaPlanParcial key={plan.materiaId} plan={plan} />)}
                </div>
              </div>
            ))}

            {sinFecha.length > 0 && (
              <div className="rounded-2xl border border-dashed border-linea-fuerte p-4 sm:p-5">
                <p className="encabezado flex items-center gap-2">
                  <CalendarPlus aria-hidden="true" size={18} className="text-acento" />
                  {sinFecha.length === 1 ? "A una materia le falta la fecha del parcial" : `A ${sinFecha.length} materias les falta la fecha del parcial`}
                </p>
                <p className="text-sm text-tinta-2 mt-1">Con la fecha, studia+ te dice cuántos temas estudiar por día.</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {sinFecha.map((m: any) => (
                    <li key={m.id}>
                      <Link href={`/materias/${m.id}`} className="btn-secundario text-sm">{m.nombre}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Primero la materia con el parcial más cercano */}
          <EvaluacionesGlobal
            materias={[...materias]
              .sort((a: any, b: any) => (planes.find((p) => p.materiaId === a.id)?.diasRestantes ?? 9999) - (planes.find((p) => p.materiaId === b.id)?.diasRestantes ?? 9999))
              .map((m: any) => ({ id: m.id, nombre: m.nombre }))}
          />
        </>
      )}
    </div>
  );
}
