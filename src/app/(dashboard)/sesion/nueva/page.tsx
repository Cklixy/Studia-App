import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { getCachedMaterias } from "@/lib/data/materias";

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
      {/* Título de la página para lectores y navegación por encabezados (cada paso usa h2) */}
      <h1 className="sr-only">Nueva sesión de estudio</h1>
      <SessionWizard initialMaterias={initialMaterias} />
    </div>
  );
}

