import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getCachedMaterias } from "@/lib/data/materias";
import { planesProximos } from "@/lib/planParcial";
import { estudioHoy, fechaLocal, rachaVigente, restarDias, ZONA_HORARIA } from "@/lib/racha";
import { elegirSiguientePaso, semanaActual } from "@/lib/siguientePaso";
import { capitalizarInicio } from "@/lib/texto";
import TarjetaSiguientePaso from "@/components/hoy/TarjetaSiguientePaso";
import SemanaRacha from "@/components/hoy/SemanaRacha";
import TarjetaPlanParcial from "@/components/TarjetaPlanParcial";
import BarraProgreso from "@/components/ui/BarraProgreso";

export const metadata: Metadata = { title: "Hoy · studia+" };

// «Hoy» (rediseño, principio 2): lo primero que ve el estudiante es su siguiente mejor acción,
// luego su semana, el parcial más cercano y sus materias. Sustituye al antiguo Inicio de /materias.
export default async function HoyPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: { session } } = await supabase.auth.getSession();

  const hoy = fechaLocal();
  const lunes = semanaActual(hoy, new Set())[0].fecha;
  // Margen de un día antes del lunes: la fecha de cada sesión se pasa a hora de Colombia después
  const desde = new Date(`${restarDias(lunes, 1)}T00:00:00Z`).toISOString();
  const hace12h = new Date(Date.now() - 12 * 3_600_000).toISOString();

  const [materias, { data: racha }, { data: sesionesSemana }, { data: abiertas }] = await Promise.all([
    getCachedMaterias(user.id, session?.access_token),
    supabase.from("rachas").select("dias, xp_total, ultima_actividad").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("sesiones")
      .select("tiempo_efectivo_segundos, hora_finalizacion")
      .eq("user_id", user.id)
      .eq("estado", "finalizada")
      .gte("hora_finalizacion", desde),
    supabase
      .from("sesiones")
      .select("id, materia_id, tema_id")
      .eq("user_id", user.id)
      .eq("estado", "activa")
      .gte("hora_inicio", hace12h)
      .order("hora_inicio", { ascending: false })
      .limit(1),
  ]);

  const lista = materias || [];
  const planes = planesProximos(lista as any);
  const paso = elegirSiguientePaso(lista as any, planes, abiertas?.[0] ?? null);

  const deEstaSemana = (sesionesSemana || []).filter((s) => s.hora_finalizacion && fechaLocal(new Date(s.hora_finalizacion)) >= lunes);
  const dias = semanaActual(hoy, new Set(deEstaSemana.map((s) => fechaLocal(new Date(s.hora_finalizacion!)))));
  const xpSemana = deEstaSemana.reduce((acc, s) => acc + Math.floor((s.tiempo_efectivo_segundos || 0) / 60) * 10, 0);
  const rachaActual = rachaVigente(racha);

  const nombre = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] || user.email?.split("@")[0] || "";
  const fechaTexto = capitalizarInicio(
    new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: ZONA_HORARIA }).format(new Date())
  );
  const subtitulo =
    paso.tipo === "primera-materia"
      ? "Empieza por tu parcial más cercano: en un minuto tendrás tu plan."
      : paso.tipo === "continuar"
        ? "Retoma donde lo dejaste."
        : "Esto es lo que te conviene hacer ahora.";

  // Planes que se muestran aparte (el primero ya puede estar en la tarjeta del siguiente paso)
  const planesVisibles = planes.slice(0, 2);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-sm font-semibold text-tinta-2">{fechaTexto}</p>
        <h1 className="titulo-1 mt-1">Hola{nombre ? `, ${nombre}` : ""}.</h1>
        <p className="subtitulo mt-1.5">{subtitulo}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-8">
          <TarjetaSiguientePaso paso={paso} />

          {planesVisibles.length > 0 && (
            <section aria-labelledby="titulo-parciales">
              <div className="flex items-center justify-between mb-3">
                <h2 id="titulo-parciales" className="antetitulo">{planesVisibles.length > 1 ? "Próximos parciales" : "Próximo parcial"}</h2>
                <Link href="/evaluaciones" className="inline-flex min-h-11 items-center gap-0.5 text-sm font-semibold text-acento">
                  Parciales <ChevronRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {planesVisibles.map((plan) => (
                  <TarjetaPlanParcial key={plan.materiaId} plan={plan} enlace={!("temaId" in paso) || plan.siguienteTema?.id !== paso.temaId} />
                ))}
              </div>
            </section>
          )}
        </div>

        {lista.length > 0 && (
          <div className="flex flex-col gap-8">
            <SemanaRacha dias={dias} racha={rachaActual} rachaAnterior={rachaActual === 0 ? racha?.dias || 0 : 0} estudioHoy={estudioHoy(racha)} xpSemana={xpSemana} />

            <section aria-labelledby="titulo-materias">
              <div className="flex items-center justify-between mb-3">
                <h2 id="titulo-materias" className="antetitulo">Tus materias</h2>
                <Link href="/materias" className="inline-flex min-h-11 items-center gap-0.5 text-sm font-semibold text-acento">
                  Ver todas <ChevronRight aria-hidden="true" size={16} />
                </Link>
              </div>
              <ul className="flex flex-col gap-2">
                {lista.slice(0, 4).map((m: any) => {
                  const total = m.temas?.length || 0;
                  const hechos = (m.temas || []).filter((t: any) => t.estado === "completado").length;
                  return (
                    <li key={m.id}>
                      <Link href={`/materias/${m.id}`} className="tarjeta flex items-center gap-4 min-h-16 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <span className="block font-semibold text-tinta truncate">{m.nombre}</span>
                          {total > 0 ? (
                            <BarraProgreso
                              valor={(hechos / total) * 100}
                              etiqueta={`Avance de ${m.nombre}`}
                              textoValor={`${hechos} de ${total} temas`}
                              className="mt-2 h-1.5"
                            />
                          ) : (
                            <span className="block text-sm text-tinta-2">Sin temas todavía</span>
                          )}
                        </div>
                        {total > 0 && <span className="text-sm text-tinta-2 tabular-nums shrink-0">{hechos}/{total}</span>}
                        <ChevronRight aria-hidden="true" size={18} className="text-tinta-3 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
