import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateTemaForm from "@/components/CreateTemaForm";
import TemaItem from "@/components/TemaItem";
import LearningMap from "@/components/LearningMap";
import EvaluacionesPanel from "@/components/EvaluacionesPanel";
import EditMateriaModal from "@/components/EditMateriaModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    .select("*")
    .eq("id", materiaId)
    .single();

  if (materiaError || !materia) {
    return <div>Error al cargar la materia</div>;
  }

  const { data: temas, error: temasError } = await supabase
    .from("temas")
    .select("*")
    .eq("materia_id", materiaId)
    .order("orden", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  const { data: route } = await supabase
    .from("study_routes")
    .select("*")
    .eq("materia_id", materiaId)
    .eq("estado", "ACTIVE")
    .single();

  return (
    <div>
      <Link href="/materias" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-6 w-fit">
        <ArrowLeft size={16} /> Volver a mis materias
      </Link>
      
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{materia.nombre}</h1>
        <EditMateriaModal materia={materia} />
      </div>

      {materia.fecha_parcial && (
        <p className="opacity-70 mb-8">
          Fecha del parcial: {new Date(materia.fecha_parcial).toLocaleDateString()}
        </p>
      )}
      {!materia.fecha_parcial && <div className="mb-8" />}

      {route ? (
        <LearningMap temas={temas || []} route={route} />
      ) : (
        <div className="surface-panel p-6 mb-8 border-dashed border-white/20 text-center">
          <h2 className="text-xl font-bold mb-2">Aún no tienes una ruta de aprendizaje</h2>
          <p className="text-text-secondary mb-4">Deja que la IA organice los temas que necesitas estudiar.</p>
          <Link href="/rutas/crear" className="btn-action inline-block">
            ✨ Crear ruta con IA
          </Link>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Temas Sueltos</h2>
      <CreateTemaForm materiaId={materiaId} />

      <div className="mt-8 mb-12">
        {temas?.length === 0 ? (
          <p className="opacity-50 py-4">No has agregado temas a esta materia todavía.</p>
        ) : (
          <div className="grid gap-2">
            {temas?.filter(t => !t.route_id).map((tema) => (
              <TemaItem key={tema.id} tema={tema} />
            ))}
          </div>
        )}
      </div>

      <EvaluacionesPanel materiaId={materiaId} />
    </div>
  );
}
