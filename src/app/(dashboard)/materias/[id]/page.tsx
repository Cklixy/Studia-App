import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateTemaForm from "@/components/CreateTemaForm";
import TemaItem from "@/components/TemaItem";
import LearningMap from "@/components/LearningMap";
import EvaluacionesPanel from "@/components/EvaluacionesPanel";
import EditMateriaModal from "@/components/EditMateriaModal";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";

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
    return <div className="p-8 text-center text-arctic-secondary">Error al cargar la materia</div>;
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link 
        href="/materias" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
      >
        <ArrowLeft size={14} />
        <span>Volver a mis materias</span>
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-arctic-slate">{materia.nombre}</h1>
            <EditMateriaModal materia={materia} />
          </div>
          {materia.fecha_parcial && (
            <p className="text-xs text-arctic-secondary mt-1 flex items-center gap-1.5">
              <Calendar size={13} className="text-cool-berry" />
              <span>Fecha del parcial: {new Date(materia.fecha_parcial).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</span>
            </p>
          )}
        </div>
      </div>

      {route ? (
        <LearningMap temas={temas || []} route={route} />
      ) : (
        <div className="apple-card p-8 mb-8 border border-dashed border-black/[0.12] bg-white/70 text-center">
          <div className="w-10 h-10 rounded-2xl bg-cool-iris/10 text-cool-iris flex items-center justify-center mx-auto mb-3">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-bold text-arctic-slate mb-1">Aún no tienes una ruta de aprendizaje</h2>
          <p className="text-xs text-arctic-secondary mb-5 max-w-sm mx-auto">
            Organiza los temas que necesitas aprender paso a paso con la inteligencia artificial.
          </p>
          <Link href="/rutas/crear" className="btn-apple-primary text-xs py-2 px-5 font-semibold apple-tactile shadow-apple-sm">
            <span>Crear ruta con IA</span>
          </Link>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-arctic-slate tracking-tight">Temario Libre</h2>
        </div>
        <CreateTemaForm materiaId={materiaId} />

        <div className="mt-5 mb-12">
          {temas?.length === 0 ? (
            <p className="text-xs text-arctic-tertiary py-4 italic">No has agregado temas a esta materia todavía.</p>
          ) : (
            <div className="grid gap-2">
              {temas?.filter(t => !t.route_id).map((tema) => (
                <TemaItem key={tema.id} tema={tema} />
              ))}
            </div>
          )}
        </div>
      </div>

      <EvaluacionesPanel materiaId={materiaId} />
    </div>
  );
}
