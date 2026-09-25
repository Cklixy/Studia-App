import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EvaluacionesGlobal from "@/components/EvaluacionesGlobal";
import { getCachedMaterias } from "@/lib/data/materias";

export default async function EvaluacionesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Fetch all materias desde la caché unificada
  const materias = await getCachedMaterias(user.id, session?.access_token);

  return (
    <div className="flex flex-col gap-8 w-full duration-500">
      <header className="pb-2 border-b border-linea">
        <span className="text-xs uppercase tracking-wider font-semibold text-tinta-3">
          Cálculo de Calificaciones
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-tinta mt-0.5">
          Evaluaciones
        </h1>
        <p className="text-tinta-2 text-sm mt-1">
          Gestiona tus calificaciones y calcula tu nota acumulada por materia en tiempo real.
        </p>
      </header>
      
      <EvaluacionesGlobal materias={materias || []} />
    </div>
  );
}
