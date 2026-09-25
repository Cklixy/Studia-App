import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { getCachedMaterias } from "@/lib/data/materias";

export const metadata: Metadata = { title: "Prepara tu sesión · studia+" };

const SessionWizard = dynamic(() => import("@/components/SessionWizard"), {
  loading: () => (
    <div aria-busy="true" className="flex flex-col gap-3">
      <span className="sr-only">Cargando…</span>
      <div className="esqueleto h-16" />
      <div className="esqueleto h-8 w-2/3" />
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="esqueleto h-14" />)}
      </div>
    </div>
  ),
});

// Si llega ?materia=&tema= (desde Hoy o una materia) el asistente empieza en «¿Qué necesitas hoy?».
// Antes esos parámetros se ignoraban y había que volver a elegir nivel, materia y tema.
export default async function NuevaSesionPage({ searchParams }: { searchParams: { materia?: string; tema?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: { session } } = await supabase.auth.getSession();

  const materias = (await getCachedMaterias(user.id, session?.access_token)) || [];
  const materia = materias.find((m: any) => m.id === searchParams.materia);
  const tema = materia?.temas?.find((t: any) => t.id === searchParams.tema);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-2">
      <h1 className="titulo-1">Prepara tu sesión</h1>
      <SessionWizard
        initialMaterias={materias.map((m: any) => ({ id: m.id, nombre: m.nombre }))}
        preMateriaId={tema && materia ? materia.id : ""}
        preMateriaNombre={tema && materia ? materia.nombre : ""}
        preTemaId={tema?.id ?? ""}
        preTemaNombre={tema?.nombre ?? ""}
      />
    </div>
  );
}
