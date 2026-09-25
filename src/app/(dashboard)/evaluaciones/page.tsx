import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EvaluacionesGlobal from "@/components/EvaluacionesGlobal";
import { getCachedMaterias } from "@/lib/data/materias";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";

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
    <div className="flex flex-col gap-8 w-full">
      <EncabezadoPantalla
        etiqueta="Parciales"
        titulo="Evaluaciones"
        descripcion="Gestiona tus calificaciones y calcula tu nota acumulada por materia en tiempo real."
      />
      
      <EvaluacionesGlobal materias={materias || []} />
    </div>
  );
}
