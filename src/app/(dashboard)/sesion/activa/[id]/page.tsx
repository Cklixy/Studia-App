import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ActiveSessionTimer from "@/components/ActiveSessionTimer";

export default async function ActiveSessionPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: session, error } = await supabase
    .from("sesiones")
    .select(`
      id,
      estado,
      duracion_planificada_minutos,
      materias ( nombre ),
      temas ( nombre )
    `)
    .eq("id", params.id)
    .single();

  if (error || !session || session.estado !== 'activa') {
    return redirect("/materias");
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[calc(100dvh-4rem)] flex items-start sm:items-center justify-center">
      <ActiveSessionTimer session={session} />
    </div>
  );
}
