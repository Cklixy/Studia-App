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
      tema_id,
      materias ( nombre ),
      temas ( nombre )
    `)
    .eq("id", params.id)
    .single();

  if (error || !session) {
    return redirect("/hoy");
  }

  const elapsed = parseInt(searchParams.elapsed || "0", 10);
  const pauses = parseInt(searchParams.pauses || "0", 10);

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <header className="text-center">
        <p className="antetitulo">{(session.materias as any)?.nombre || "Sesión de estudio"}</p>
        <h1 className="titulo-1 mt-2">
          ¡Sesión <span className="resaltado resaltado-animado">completada</span>!
        </h1>
        <p className="subtitulo mt-2">Cuéntanos cómo te fue: tres toques y listo.</p>
      </header>
      <SessionFeedbackForm session={session} elapsed={elapsed} pauses={pauses} />
    </div>
  );
}
