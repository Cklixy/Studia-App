import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import CreateTemaForm from "@/components/CreateTemaForm";
import FilaTema from "@/components/temas/FilaTema";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";
import { calcularPlanParcial } from "@/lib/planParcial";
import TarjetaPlanParcial from "@/components/TarjetaPlanParcial";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import { formatearFechaLocal } from "@/lib/texto";

// Lazy loading de componentes cliente pesados (modal y panel de evaluaciones)
const EditMateriaModal = dynamic(() => import("@/components/EditMateriaModal"), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-full bg-black/[0.04]" />,
});

const EvaluacionesPanel = dynamic(() => import("@/components/EvaluacionesPanel"), {
  loading: () => (
    <div className="h-48 rounded-2xl apple-shimmer" />
  ),
});

export default async function MateriaDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const materiaId = params.id;

  const { data: materia, error: materiaError } = await supabase
    .from("materias")
    .select(`
      id,
      nombre,
      descripcion,
      fecha_parcial,
      temas (
        id,
        nombre,
        estado,
        orden,
        materia_id,
        route_id,
        tipo_contenido,
        minutos_estimados,
        dificultad,
        created_at
      ),
      study_routes (
        id,
        materia_id,
        title,
        estado,
        created_at
      )
    `)
    .eq("id", materiaId)
    .single();

  if (materiaError || !materia) {
    return <div className="p-8 text-center text-arctic-secondary">Error al cargar la materia</div>;
  }

  // Extraer temas ordenados y ruta activa desde la consulta única
  const temas = (materia.temas as any[] || []).sort((a: any, b: any) =>
    (a.orden ?? 999) - (b.orden ?? 999) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const route = (materia.study_routes as any[] || []).find((r: any) => r.estado === "ACTIVE") || null;
  const temasRuta = route ? temas.filter((t: any) => t.route_id === route.id) : [];
  const temasPropios = temas.filter((t: any) => !route || t.route_id !== route.id);
  const siguienteRutaId = temasRuta.find((t: any) => t.estado !== "completado")?.id;
  const completados = temas.filter((t: any) => t.estado === "completado").length;
  const avance = temas.length ? Math.round((completados / temas.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <Link
        href="/materias"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Volver a mis materias</span>
      </Link>

      <EncabezadoPantalla
        titulo={materia.nombre}
        junto={<EditMateriaModal materia={materia} />}
        descripcion={
          materia.fecha_parcial && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-cool-berry shrink-0" aria-hidden="true" />
              <span>Fecha del parcial: {formatearFechaLocal(materia.fecha_parcial, { day: "numeric", month: "long" })}</span>
            </span>
          )
        }
      />

      {(() => {
        const plan = calcularPlanParcial(materia as any);
        return plan ? <TarjetaPlanParcial plan={plan} mostrarMateria={false} /> : null;
      })()}

      {/* Temario: la ruta IA y los temas propios con la misma fila (antes, dos listas con estilos y
          acciones distintas: «Ruta curricular» y «Temario libre») */}
      <section aria-labelledby="temario-titulo" className="space-y-4">
        <div className="px-1">
          <h2 id="temario-titulo" className="apple-title-2 text-arctic-slate">Temario</h2>
          <p className="text-sm text-arctic-secondary mt-0.5">
            {temas.length === 0
              ? "Aún no hay temas en esta materia."
              : `${completados} de ${temas.length} temas completados · ${avance}%`}
          </p>
          {temas.length > 0 && (
            <div
              role="progressbar"
              aria-label="Temas completados"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={avance}
              className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden mt-2.5 max-w-md"
            >
              <div className="h-full rounded-full bg-glacier-blue" style={{ width: `${avance}%` }} />
            </div>
          )}
        </div>

        {route ? (
          <div className="apple-card p-0 overflow-hidden">
            <div className="px-5 pt-4 pb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-cool-iris shrink-0" aria-hidden="true" />
              <h3 className="apple-headline text-arctic-slate truncate">{route.title || "Ruta de estudio"}</h3>
            </div>
            <ol className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
              {temasRuta.map((tema: any, i: number) => (
                <FilaTema
                  key={tema.id}
                  tema={tema}
                  materiaNombre={materia.nombre}
                  numero={i + 1}
                  siguiente={tema.id === siguienteRutaId}
                />
              ))}
            </ol>
          </div>
        ) : (
          <div className="apple-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div aria-hidden="true" className="w-10 h-10 rounded-2xl bg-cool-iris/10 text-cool-iris flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="flex-1">
              <h3 className="apple-headline text-arctic-slate">Organiza el temario con IA</h3>
              <p className="text-sm text-arctic-secondary">Crea una ruta con los temas en el orden ideal para tu objetivo.</p>
            </div>
            <Link href="/rutas/crear" className="btn-apple-secondary text-sm min-h-11 px-4 apple-tactile shrink-0">
              <span>Crear ruta con IA</span>
            </Link>
          </div>
        )}

        <div className="apple-card p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-1">
            <h3 className="apple-headline text-arctic-slate">{route ? "Temas propios" : "Temas"}</h3>
          </div>
          <div className="px-5 pb-4">
            <CreateTemaForm materiaId={materiaId} />
          </div>
          {temasPropios.length > 0 && (
            <ul className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
              {temasPropios.map((tema: any) => (
                <FilaTema key={tema.id} tema={tema} materiaNombre={materia.nombre} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="notas-titulo" className="space-y-4">
        <h2 id="notas-titulo" className="apple-title-2 text-arctic-slate px-1">Notas y parciales</h2>
        <EvaluacionesPanel materiaId={materiaId} />
      </section>
    </div>
  );
}
