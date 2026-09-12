import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EvaluacionesGlobal from "@/components/EvaluacionesGlobal";

export default async function EvaluacionesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch all materias
  const { data: materias, error } = await supabase
    .from("materias")
    .select("id, nombre, fecha_parcial")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching materias", error);
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Evaluaciones</h1>
        <p className="text-text-secondary text-sm">Gestiona tus calificaciones y calcula tu nota acumulada por materia.</p>
      </header>
      
      <EvaluacionesGlobal materias={materias || []} />
    </div>
  );
}
