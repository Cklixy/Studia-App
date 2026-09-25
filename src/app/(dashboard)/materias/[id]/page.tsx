import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import CreateTemaForm from "@/components/CreateTemaForm";
import TemaItem from "@/components/TemaItem";
import LearningMap from "@/components/LearningMap";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";
import { calcularPlanParcial } from "@/lib/planParcial";
import TarjetaPlanParcial from "@/components/TarjetaPlanParcial";

// Lazy loading de componentes cliente pesados (modal y panel de evaluaciones)
const EditMateriaModal = dynamic(() => import("@/components/EditMateriaModal"), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-full bg-hundido" />,
});

const EvaluacionesPanel = dynamic(() => import("@/components/EvaluacionesPanel"), {
  loading: () => (
    <div className="h-48 rounded-2xl bg-hundido border border-linea animate-pulse" />
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
    return <div className="p-8 text-center text-tinta-2">Error al cargar la materia</div>;
  }

  // Extraer temas ordenados y ruta activa desde la consulta única
  const temas = (materia.temas as any[] || []).sort((a: any, b: any) =>
    (a.orden ?? 999) - (b.orden ?? 999) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const route = (materia.study_routes as any[] || []).find((r: any) => r.estado === "ACTIVE") || null;

  return (
    <div className="space-y-8 duration-500">
      <Link
        href="/materias"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-tinta-2 hover:text-tinta transition-colors tactil"
      >
        <ArrowLeft size={14} />
        <span>Volver a mis materias</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-linea">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-tinta">{materia.nombre}</h1>
            <EditMateriaModal materia={materia} />
          </div>
          {materia.fecha_parcial && (
            <p className="text-xs text-tinta-2 mt-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-error" />
              <span>Fecha del parcial: {new Date(materia.fecha_parcial).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</span>
            </p>
          )}
        </div>
      </div>

      {(() => {
        const plan = calcularPlanParcial(materia as any);
        return plan ? <div className="mb-8"><TarjetaPlanParcial plan={plan} mostrarMateria={false} /></div> : null;
      })()}

      {route ? (
        // Solo los temas de la ruta: los manuales se listan aparte en «Temario libre» (antes salían duplicados)
        <LearningMap temas={(temas || []).filter((t: any) => t.route_id === route.id)} route={route} />
      ) : (
        <div className="tarjeta p-8 mb-8 border border-dashed border-linea bg-superficie text-center">
          <div className="w-10 h-10 rounded-2xl bg-acento/10 text-acento flex items-center justify-center mx-auto mb-3">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-bold text-tinta mb-1">Aún no tienes una ruta de aprendizaje</h2>
          <p className="text-xs text-tinta-2 mb-5 max-w-sm mx-auto">
            Organiza los temas que necesitas aprender paso a paso con la inteligencia artificial.
          </p>
          <Link href="/rutas/crear" className="btn-primario text-xs py-2 px-5 font-semibold tactil shadow-1">
            <span>Crear ruta con IA</span>
          </Link>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-tinta tracking-tight">Temario Libre</h2>
        </div>
        <CreateTemaForm materiaId={materiaId} />

        <div className="mt-5 mb-12">
          {temas?.length === 0 ? (
            <p className="text-xs text-tinta-3 py-4 italic">No has agregado temas a esta materia todavía.</p>
          ) : (
            <div className="grid gap-2">
              {temas?.filter(t => !t.route_id).map((tema) => (
                <TemaItem key={tema.id} tema={tema} materiaNombre={materia.nombre} />
              ))}
            </div>
          )}
        </div>
      </div>

      <EvaluacionesPanel materiaId={materiaId} />
    </div>
  );
}
