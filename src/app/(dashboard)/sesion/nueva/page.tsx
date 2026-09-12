import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SessionWizard from "@/components/SessionWizard";

export default async function NuevaSesionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Cargar las materias personales del usuario
  const { data: materias } = await supabase
    .from("materias")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto">
      <SessionWizard initialMaterias={materias || []} />
    </div>
  );
}
