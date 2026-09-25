import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const SessionWizard = dynamic(() => import("@/components/SessionWizard"), {
  loading: () => (
    <div className="tarjeta p-8 sm:p-10 space-y-6 animate-pulse bg-superficie border border-linea shadow-1">
      <div className="h-3 w-28 bg-hundido rounded-full" />
      <div className="h-8 w-64 bg-hundido rounded-xl" />
      <div className="h-3.5 w-96 max-w-full bg-hundido rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="h-28 bg-hundido rounded-2xl border border-linea" />
        <div className="h-28 bg-hundido rounded-2xl border border-linea" />
      </div>
    </div>
  ),
});

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
    .select("id, nombre, materia_id, materias(id, nombre)")
    .eq("id", temaId)
    .single();

  if (!tema) {
    return redirect("/hoy");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <SessionWizard 
        initialMaterias={[]} 
        initialStep={4}
        preNivel="Universidad"
        preMateriaId={tema.materia_id}
        preMateriaNombre={(tema.materias as any)?.nombre}
        preTemaId={tema.id}
        preTemaNombre={tema.nombre}
      />
    </div>
  );
}
