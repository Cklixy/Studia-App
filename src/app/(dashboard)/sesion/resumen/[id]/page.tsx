import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SessionFeedbackForm from "@/components/SessionFeedbackForm";
import ResumenLogro from "@/components/ResumenLogro";

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
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      <h1 className="apple-large-title text-arctic-slate text-center">¡Sesión finalizada!</h1>
      <p className="text-sm text-arctic-secondary text-center mt-1.5 mb-6">
        {[(session.materias as any)?.nombre, (session.temas as any)?.nombre].filter(Boolean).join(" · ")}
        {session.duracion_planificada_minutos ? ` · planificado ${session.duracion_planificada_minutos} min` : ""}
      </p>
      <ResumenLogro elapsed={elapsed} pauses={pauses} />
      <SessionFeedbackForm session={session} elapsed={elapsed} pauses={pauses} />
    </div>
  );
}
