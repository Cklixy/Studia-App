import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft, Play, Sparkles } from "lucide-react";
import CreateTemaForm from "@/components/CreateTemaForm";
import TemaItem from "@/components/TemaItem";
import { calcularPlanParcial } from "@/lib/planParcial";
import { plural } from "@/lib/texto";
import TarjetaPlanParcial from "@/components/TarjetaPlanParcial";

// Lazy loading de componentes cliente pesados (modal y panel de evaluaciones)
const EditMateriaModal = dynamic(() => import("@/components/EditMateriaModal"), {
  ssr: false,
  loading: () => <div className="w-11 h-11 rounded-full bg-hundido" />,
});

const EvaluacionesPanel = dynamic(() => import("@/components/EvaluacionesPanel"), {
  loading: () => <div aria-hidden="true" className="h-48 esqueleto rounded-2xl" />,
});

// Detalle de materia (rediseño 4.2): una acción principal (estudiar el tema que toca), el plan
// hasta el parcial, todos los temas en una sola lista y las notas al final.
export default async function MateriaDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { nueva?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: materia, error } = await supabase
    .from("materias")
    .select(`
      id, nombre, descripcion, fecha_parcial,
      temas ( id, nombre, estado, orden, materia_id, route_id, tipo_contenido, minutos_estimados, dificultad, created_at ),
      study_routes ( id, materia_id, title, estado, created_at )
    `)
    .eq("id", params.id)
    .single();

  if (error || !materia) notFound();

  const temas = ((materia.temas as any[]) || []).sort(
    (a: any, b: any) => (a.orden ?? 999) - (b.orden ?? 999) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const ruta = ((materia.study_routes as any[]) || []).find((r: any) => r.estado === "ACTIVE") || null;
  // Temas de la ruta IA primero (en su orden), luego los agregados a mano
  const deRuta = ruta ? temas.filter((t: any) => t.route_id === ruta.id) : [];
  const manuales = temas.filter((t: any) => !ruta || t.route_id !== ruta.id);
  const ordenados = [...deRuta, ...manuales];
  const siguiente = ordenados.find((t: any) => t.estado !== "completado") || null;
  const hechos = temas.filter((t: any) => t.estado === "completado").length;
  const plan = calcularPlanParcial(materia as any);
  const recienCreada = searchParams.nueva === "1" && temas.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/materias" className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-tinta-2 hover:text-tinta">
          <ChevronLeft aria-hidden="true" size={18} />
          Materias
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="titulo-1 break-words">{materia.nombre}</h1>
            <p className="subtitulo mt-1.5">
              {temas.length ? `${hechos} de ${plural(temas.length, "tema", "temas")} completados` : "Sin temas todavía"}
            </p>
          </div>
          <EditMateriaModal materia={materia} />
        </div>

        {siguiente && (
          <Link href={`/sesion/nueva?materia=${materia.id}&tema=${siguiente.id}`} className="btn-primario text-base min-h-12 mt-5 w-full sm:w-auto">
            <Play aria-hidden="true" size={18} />
            <span className="truncate">Estudiar «{siguiente.nombre}»</span>
          </Link>
        )}
      </div>

      {plan && <TarjetaPlanParcial plan={plan} mostrarMateria={false} nivel="h2" enlace={!siguiente} />}

      <section id="temas" aria-labelledby="titulo-temas" className="flex flex-col gap-3 scroll-mt-20">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="titulo-temas" className="titulo-2">Temas</h2>
            {ruta && <p className="text-sm text-tinta-2 mt-0.5">Ordenados por tu plan con IA «{ruta.title}»</p>}
          </div>
          {!ruta && temas.length > 0 && (
            <Link href="/rutas/crear" className="btn-fantasma text-sm shrink-0">
              <Sparkles aria-hidden="true" size={16} />
              Ordenar con IA
            </Link>
          )}
        </div>

        {recienCreada && (
          <p role="status" className="chip chip-exito self-start">Materia creada. Ahora agrega sus temas.</p>
        )}

        {ordenados.length > 0 && (
          <ol className="flex flex-col gap-2">
            {ordenados.map((tema: any, i: number) => (
              <li key={tema.id}>
                <TemaItem tema={tema} materiaNombre={materia.nombre} materiaId={materia.id} numero={i + 1} actual={tema.id === siguiente?.id} />
              </li>
            ))}
          </ol>
        )}

        <CreateTemaForm materiaId={materia.id} destacado={temas.length === 0} />
      </section>

      <EvaluacionesPanel materiaId={materia.id} />
    </div>
  );
}
