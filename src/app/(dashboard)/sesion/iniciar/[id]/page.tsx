import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Empezar a estudiar un tema concreto (desde el mapa de la ruta): se resuelve su materia y se
 * pasa al asistente de nueva sesión, que empieza directamente en el paso 2.
 */
export default async function IniciarSesionDirectaPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: tema } = await supabase.from("temas").select("id, materia_id").eq("id", params.id).single();

  if (!tema) {
    return redirect("/materias");
  }

  return redirect(`/sesion/nueva?materia=${tema.materia_id}&tema=${tema.id}`);
}
