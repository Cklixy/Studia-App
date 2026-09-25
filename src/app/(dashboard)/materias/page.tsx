import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getCachedMaterias } from "@/lib/data/materias";
import { calcularPlanParcial } from "@/lib/planParcial";
import { plural } from "@/lib/texto";
import CreateMateriaForm from "@/components/CreateMateriaForm";
import EstadoVacio from "@/components/ui/EstadoVacio";
import BarraProgreso from "@/components/ui/BarraProgreso";

export const metadata: Metadata = { title: "Materias · studia+" };

// Materias (rediseño 4.2): lista para crear y navegar con pocos toques. Cada fila lleva a la materia,
// donde están sus temas, su plan y la acción de estudiar. Antes, las materias vivían mezcladas con el Inicio.
export default async function MateriasPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: { session } } = await supabase.auth.getSession();

  const materias = (await getCachedMaterias(user.id, session?.access_token)) || [];

  // Primero las que tienen parcial más cercano; luego el resto por nombre
  const filas = materias
    .map((m: any) => {
      const temas = m.temas || [];
      const hechos = temas.filter((t: any) => t.estado === "completado").length;
      const plan = calcularPlanParcial(m);
      return { m, total: temas.length, hechos, plan };
    })
    .sort((a, b) => (a.plan?.diasRestantes ?? 9999) - (b.plan?.diasRestantes ?? 9999) || a.m.nombre.localeCompare(b.m.nombre, "es"));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="titulo-1">Materias</h1>
          <p className="subtitulo mt-1.5">
            {materias.length ? `${plural(materias.length, "materia", "materias")} este semestre.` : "Aquí vivirán tus asignaturas y sus temas."}
          </p>
        </div>
        {materias.length > 0 && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Link href="/rutas/crear" className="btn-fantasma">
              <Sparkles aria-hidden="true" size={18} />
              Plan con IA
            </Link>
            <CreateMateriaForm variante="primario" />
          </div>
        )}
      </header>

      {materias.length === 0 ? (
        <EstadoVacio
          icono={BookOpen}
          titulo="Aún no tienes materias"
          texto="Crea tu primera materia con la fecha de su parcial. Después agregas los temas y studia+ te dice qué estudiar cada día."
          accion={
            <>
              <CreateMateriaForm variante="primario" />
              <Link href="/rutas/crear" className="btn-fantasma">
                <Sparkles aria-hidden="true" size={18} />
                Que la IA arme los temas
              </Link>
            </>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filas.map(({ m, total, hechos, plan }) => (
            <li key={m.id}>
              <Link href={`/materias/${m.id}`} className="tarjeta flex flex-col gap-3 p-4 sm:p-5 h-full">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="titulo-3">{m.nombre}</h2>
                  <ChevronRight aria-hidden="true" size={20} className="text-tinta-3 shrink-0 mt-0.5" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan ? (
                    <span className={`chip ${plan.diasRestantes <= 3 ? "chip-aviso" : "chip-acento"}`}>
                      {plan.diasRestantes === 0 ? "Parcial hoy" : plan.diasRestantes === 1 ? "Parcial mañana" : `Parcial en ${plan.diasRestantes} días`}
                    </span>
                  ) : (
                    <span className="chip">Sin fecha de parcial</span>
                  )}
                  {total > 0 && hechos === total && <span className="chip chip-exito">Temas completos</span>}
                </div>
                {total > 0 ? (
                  <div className="mt-auto flex items-center gap-3">
                    <BarraProgreso valor={(hechos / total) * 100} etiqueta={`Avance de ${m.nombre}`} textoValor={`${hechos} de ${total} temas`} tono="exito" className="flex-1" />
                    <span className="text-sm text-tinta-2 tabular-nums">{hechos}/{total} temas</span>
                  </div>
                ) : (
                  <p className="mt-auto text-sm font-semibold text-acento">Agrega sus temas →</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
