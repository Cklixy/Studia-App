import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, Clock, History, Play, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HistoryFilters from "@/components/HistoryFilters";
import { getCachedMaterias } from "@/lib/data/materias";
import { formatHumanDuration, formatNaturalDate } from "@/lib/format-session";
import { fechaLocal, restarDias } from "@/lib/racha";
import { plural } from "@/lib/texto";
import NavProgreso from "@/components/NavProgreso";
import GraficoSemana from "@/components/GraficoSemana";
import EstadoVacio from "@/components/ui/EstadoVacio";

export const metadata: Metadata = { title: "Progreso · studia+" };

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Progreso · Historial (rediseño 4.6): gráfico de la semana legible sin color, resumen corto,
// sesión sin terminar y lista. Sin sesiones: un estado vacío con una salida (antes decía
// «no coinciden con los filtros» aunque nunca hubiera habido sesiones y mostraba ceros).
export default async function HistorialPage({ searchParams }: { searchParams: { materia?: string; rango?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: { session } } = await supabase.auth.getSession();

  let query = supabase
    .from("sesiones")
    .select(`id, tiempo_efectivo_segundos, hora_finalizacion, resultado_logro, metodo_utilizado, objetivo, materias ( nombre ), temas ( nombre )`)
    .eq("user_id", user.id)
    .eq("estado", "finalizada")
    .order("hora_finalizacion", { ascending: false });
  if (searchParams.materia) query = query.eq("materia_id", searchParams.materia);
  if (searchParams.rango && searchParams.rango !== "all") {
    const limite = new Date();
    limite.setDate(limite.getDate() - (searchParams.rango === "7d" ? 7 : 30));
    query = query.gte("hora_finalizacion", limite.toISOString());
  }

  const hoy = fechaLocal();
  const hace7 = new Date(`${restarDias(hoy, 7)}T00:00:00Z`).toISOString();

  const [cachedMaterias, { data: sesiones, error }, { data: activas }, { data: ultimos7 }] = await Promise.all([
    getCachedMaterias(user.id, session?.access_token),
    query,
    supabase.from("sesiones").select("id, hora_inicio, materias ( nombre ), temas ( nombre )").eq("user_id", user.id).eq("estado", "activa").order("hora_inicio", { ascending: false }).limit(1),
    supabase.from("sesiones").select("tiempo_efectivo_segundos, hora_finalizacion").eq("user_id", user.id).eq("estado", "finalizada").gte("hora_finalizacion", hace7),
  ]);

  const materias = (cachedMaterias || []).map((m: any) => ({ id: m.id, nombre: m.nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const hayFiltros = Boolean(searchParams.materia || (searchParams.rango && searchParams.rango !== "all"));
  const lista = sesiones || [];
  const minutos = Math.floor(lista.reduce((s, x) => s + (x.tiempo_efectivo_segundos || 0), 0) / 60);
  const logradas = lista.filter((s) => s.resultado_logro === "Si" || s.resultado_logro === "Sí").length;

  // Minutos por día de los últimos 7 días (hora de Colombia)
  const porDia = new Map<string, number>();
  for (const s of ultimos7 || []) {
    if (!s.hora_finalizacion) continue;
    const d = fechaLocal(new Date(s.hora_finalizacion));
    porDia.set(d, (porDia.get(d) || 0) + Math.floor((s.tiempo_efectivo_segundos || 0) / 60));
  }
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = restarDias(hoy, 6 - i);
    const nombre = DIAS[new Date(`${fecha}T12:00:00Z`).getUTCDay()];
    return { etiqueta: "DLMXJVS"[new Date(`${fecha}T12:00:00Z`).getUTCDay()], nombre, minutos: porDia.get(fecha) || 0, esHoy: fecha === hoy };
  });
  const sinNada = lista.length === 0 && !hayFiltros;
  const activa = activas?.[0] as any;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="titulo-1">Progreso</h1>
        <NavProgreso activo="historial" />
      </header>

      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-error-suave px-4 py-3 text-sm font-semibold text-error">
          <AlertCircle aria-hidden="true" size={18} /> No pudimos cargar todas tus sesiones. Recarga la página.
        </p>
      )}

      {activa && (
        <section aria-label="Sesión sin terminar" className="tarjeta flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-acento">Tienes una sesión sin terminar</p>
            <p className="font-semibold text-tinta truncate">{activa.temas?.nombre || activa.materias?.nombre || "Sesión de estudio"}</p>
          </div>
          <Link href={`/sesion/activa/${activa.id}`} className="btn-primario shrink-0">
            <Play aria-hidden="true" size={18} /> Continuar
          </Link>
        </section>
      )}

      {sinNada ? (
        <EstadoVacio
          icono={History}
          titulo="Aquí verás tu progreso"
          texto="Cada sesión que termines suma minutos, XP y un día a tu racha. Empieza con una corta: 15 minutos bastan."
          accion={<Link href="/hoy" className={activa ? "btn-secundario" : "btn-primario"}>Ver qué me toca hoy</Link>}
        />
      ) : (
        <>
          <GraficoSemana dias={dias} />

          <dl className="grid grid-cols-3 gap-2">
            {[
              { icono: Clock, etiqueta: "Minutos", valor: String(minutos) },
              { icono: History, etiqueta: "Sesiones", valor: String(lista.length) },
              { icono: Target, etiqueta: "Objetivos logrados", valor: `${logradas}/${lista.length}` },
            ].map(({ icono: Icono, etiqueta, valor }) => (
              <div key={etiqueta} className="tarjeta p-3 sm:p-4 flex flex-col">
                <dt className="flex items-center gap-1.5 text-xs font-semibold text-tinta-2">
                  <Icono aria-hidden="true" size={14} /> {etiqueta}
                </dt>
                <dd className="font-display text-3xl leading-none text-tinta tabular-nums mt-2">{valor}</dd>
              </div>
            ))}
          </dl>
          {hayFiltros && <p className="-mt-5 text-xs text-tinta-2">Resumen de las sesiones filtradas.</p>}

          <section aria-labelledby="titulo-sesiones" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="titulo-sesiones" className="titulo-2">Sesiones</h2>
              <span className="text-sm text-tinta-2">{plural(lista.length, "sesión", "sesiones")}</span>
            </div>
            <HistoryFilters materias={materias} />

            {lista.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-linea-fuerte p-6 text-center">
                <p className="encabezado">No hay sesiones con estos filtros</p>
                <Link href="/historial" className="mt-2 inline-flex min-h-11 items-center font-semibold text-acento underline underline-offset-2">Quitar filtros</Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {lista.map((s: any) => {
                  const logro = s.resultado_logro === "Si" || s.resultado_logro === "Sí" ? { t: "Objetivo logrado", c: "chip-exito" } : s.resultado_logro === "Parcialmente" ? { t: "Logro parcial", c: "chip-aviso" } : s.resultado_logro === "No" ? { t: "Sin lograr", c: "" } : null;
                  return (
                    <li key={s.id} className="tarjeta p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-tinta truncate">{s.temas?.nombre || s.objetivo || "Sesión de estudio"}</p>
                          <p className="text-sm text-tinta-2 truncate">{s.materias?.nombre || "Materia eliminada"}</p>
                        </div>
                        <span className="font-semibold text-tinta tabular-nums shrink-0">{formatHumanDuration(s.tiempo_efectivo_segundos || 0)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-tinta-2">
                        <span>{formatNaturalDate(s.hora_finalizacion)}</span>
                        {s.metodo_utilizado && <span>{s.metodo_utilizado}</span>}
                        {logro && <span className={`chip ${logro.c}`}>{logro.t}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
