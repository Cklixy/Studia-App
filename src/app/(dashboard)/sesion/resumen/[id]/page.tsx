import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SessionFeedbackForm from "@/components/SessionFeedbackForm";

export default async function ResumenSesionPage({ params, searchParams }: { params: { id: string }, searchParams: { elapsed?: string, pauses?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: session, error } = await supabase
    .from("sesiones")
    .select(`
      id,
      duracion_planificada_minutos,
      materias ( nombre ),
      temas ( nombre )
    `)
    .eq("id", params.id)
    .single();

  if (error || !session) {
    return redirect("/materias");
  }

  const elapsed = parseInt(searchParams.elapsed || "0", 10);
  const pauses = parseInt(searchParams.pauses || "0", 10);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">¡Sesión Finalizada! 🎉</h1>
      <SessionFeedbackForm session={session} elapsed={elapsed} pauses={pauses} />
    </div>
  );
}
