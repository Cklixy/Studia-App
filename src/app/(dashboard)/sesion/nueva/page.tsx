import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { getCachedMaterias } from "@/lib/data/materias";

const SessionWizard = dynamic(() => import("@/components/SessionWizard"), {
  loading: () => (
    <div className="apple-card p-8 sm:p-10 space-y-6 animate-pulse bg-white/90 border border-black/[0.06] shadow-apple-sm">
      <div className="h-3 w-28 bg-black/[0.06] rounded-full" />
      <div className="h-8 w-64 bg-black/[0.08] rounded-xl" />
      <div className="h-3.5 w-96 max-w-full bg-black/[0.04] rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="h-28 bg-black/[0.03] rounded-2xl border border-black/[0.05]" />
        <div className="h-28 bg-black/[0.03] rounded-2xl border border-black/[0.05]" />
      </div>
    </div>
  ),
});

export default async function NuevaSesionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: { session } } = await supabase.auth.getSession();

  // Cargar las materias personales del usuario desde la caché optimizada
  const materias = await getCachedMaterias(user.id, session?.access_token);
  const initialMaterias = (materias || []).map((m) => ({ id: m.id, nombre: m.nombre }));

  return (
    <div className="max-w-3xl mx-auto">
      <SessionWizard initialMaterias={initialMaterias} />
    </div>
  );
}

