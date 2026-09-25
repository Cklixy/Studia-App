import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const SessionWizard = dynamic(() => import("@/components/SessionWizard"), {
  loading: () => <div aria-busy="true" className="esqueleto h-64"><span className="sr-only">Cargando…</span></div>,
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
    <div className="max-w-2xl mx-auto flex flex-col gap-2">
      <h1 className="titulo-1">Prepara tu sesión</h1>
      <SessionWizard
        initialMaterias={[]}
        preMateriaId={tema.materia_id}
        preMateriaNombre={(tema.materias as any)?.nombre}
        preTemaId={tema.id}
        preTemaNombre={tema.nombre}
      />
    </div>
  );
}
