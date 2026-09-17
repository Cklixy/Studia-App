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
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <header className="pb-2 border-b border-black/[0.06]">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-arctic-tertiary">
          Cálculo de Calificaciones
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-arctic-slate mt-0.5">
          Evaluaciones
        </h1>
        <p className="text-arctic-secondary text-sm mt-1">
          Gestiona tus calificaciones y calcula tu nota acumulada por materia en tiempo real.
        </p>
      </header>
      
      <EvaluacionesGlobal materias={materias || []} />
    </div>
  );
}
