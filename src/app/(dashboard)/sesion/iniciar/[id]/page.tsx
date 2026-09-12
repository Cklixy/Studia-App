import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SessionWizard from "@/components/SessionWizard";

export default async function IniciarSesionDirectaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const temaId = params.id;

  // Cargar el tema y su materia
  const { data: tema } = await supabase
    .from("temas")
    .select("*, materias(*)")
    .eq("id", temaId)
    .single();

  if (!tema) {
    return redirect("/materias");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <SessionWizard 
        initialMaterias={[]} 
        initialStep={4}
        preNivel="Universidad"
        preMateriaId={tema.materia_id}
        preMateriaNombre={tema.materias?.nombre}
        preTemaId={tema.id}
        preTemaNombre={tema.nombre}
      />
    </div>
  );
}
