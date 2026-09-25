import { createClient } from "@/utils/supabase/server";
import { capitalizarInicio, formatearFechaLocal, plural } from "@/lib/texto";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import ListaEscalonada from "@/components/ui/ListaEscalonada";
import { fechaLocal, inicioSemanaLocal, nivelDesdeXp, rachaVigente, ZONA_HORARIA } from "@/lib/racha";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import CreateMateriaForm from "@/components/CreateMateriaForm";
import Link from "next/link";
import { getCachedMaterias } from "@/lib/data/materias";
import { planesProximos } from "@/lib/planParcial";
import { calcularSiguientePaso } from "@/lib/siguientePaso";
import TarjetaHoy from "@/components/inicio/TarjetaHoy";
import TarjetaSemana from "@/components/inicio/TarjetaSemana";
import { Sparkles, Calendar, ChevronRight } from "lucide-react";

// Client component diferido únicamente para Web Push API
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), {
  ssr: false,
});

/** Color de la insignia del parcial según lo que falta: solo es roja cuando de verdad urge. */
function tonoParcial(diasRestantes: number) {
  if (diasRestantes <= 7) return "text-cool-berry bg-cool-berry/10 border-cool-berry/20";
  if (diasRestantes <= 14) return "text-amber-700 bg-amber-500/10 border-amber-500/25";
  return "text-arctic-secondary bg-black/[0.04] border-black/[0.06]";
}

function diasHasta(fecha: string, hoy: string) {
  return Math.round((Date.parse(`${fecha.slice(0, 10)}T00:00:00Z`) - Date.parse(`${hoy}T00:00:00Z`)) / 86_400_000);
}

export default async function MateriasPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Estudiante";
  const metaSemanal = Number(user.user_metadata?.meta_semanal_minutos) || null;

  const [materias, { data: rachaData }, { data: sesionesSemana }] = await Promise.all([
    getCachedMaterias(user.id, session?.access_token),
    supabase.from("rachas").select("dias, xp_total, nivel_actual, ultima_actividad").eq("user_id", user.id).single(),
    supabase
      .from("sesiones")
      .select("tiempo_efectivo_segundos")
      .eq("user_id", user.id)
      .eq("estado", "finalizada")
      .gte("hora_finalizacion", inicioSemanaLocal()),
  ]);

  // Solo cuenta si la última sesión fue hoy o ayer (antes se mostraba una racha ya rota)
  const rachaActual = rachaVigente(rachaData);
  const rachaAnterior = rachaActual === 0 ? rachaData?.dias || 0 : 0;
  const sinMaterias = !materias || materias.length === 0;
  const xpTotal = rachaData?.xp_total || 0;
  const minutosSemana = Math.floor((sesionesSemana || []).reduce((acc, s) => acc + (s.tiempo_efectivo_segundos || 0), 0) / 60);

  const hoy = fechaLocal();
  const paso = calcularSiguientePaso(materias);
  // Los demás parciales cercanos (el de «Hoy» ya se muestra arriba)
  const otrosParciales = planesProximos(materias)
    .filter((p) => p.materiaId !== paso?.materiaId)
    .slice(0, 3);

  const fechaHoy = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONA_HORARIA,
  }).format(new Date());

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full">
      <EncabezadoPantalla
        etiqueta={capitalizarInicio(fechaHoy)}
        titulo={`Hola, ${firstName}`}
        descripcion={
          rachaActual > 0
            ? `Llevas ${plural(rachaActual, "día seguido", "días seguidos")} de enfoque académico. ¡Excelente constancia!`
            : rachaAnterior > 1
              ? `Tu racha anterior fue de ${rachaAnterior} días. Una sesión hoy empieza una nueva.`
              : "Comienza una sesión hoy para activar tu racha de estudio."
        }
        acciones={
          <>
            <Link
              href="/rutas"
              className="btn-apple-secondary text-xs font-semibold py-2 px-3.5 sm:px-4 apple-tactile inline-flex items-center gap-2 shrink-0"
            >
              <Sparkles size={14} className="text-glacier-blue" aria-hidden="true" />
              <span>Crear ruta IA</span>
            </Link>
            <CreateMateriaForm />
          </>
        }
      />

      {/* Hoy + Tu semana */}
      <ListaEscalonada className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5" classNameElemento="grid">
        <TarjetaHoy paso={paso} sinMaterias={sinMaterias} />
        <TarjetaSemana
          racha={rachaActual}
          minutosSemana={minutosSemana}
          metaMinutos={metaSemanal}
          nivel={nivelDesdeXp(xpTotal)}
          xpTotal={xpTotal}
        />
      </ListaEscalonada>

      {/* Otros parciales próximos */}
      {otrosParciales.length > 0 && (
        <section aria-labelledby="parciales-titulo" className="space-y-3">
          <h2 id="parciales-titulo" className="apple-title-3 text-arctic-slate px-1">
            Próximos parciales
          </h2>
          <ul className="apple-card p-0 divide-y divide-black/[0.06] overflow-hidden">
            {otrosParciales.map((p) => (
              <li key={p.materiaId}>
                <Link
                  href={`/materias/${p.materiaId}`}
                  className="flex items-center gap-4 px-5 py-4 min-h-14 hover:bg-black/[0.02] transition-colors"
                >
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 tabular-nums ${tonoParcial(p.diasRestantes)}`}>
                    {p.diasRestantes === 0 ? "Hoy" : p.diasRestantes === 1 ? "Mañana" : `${p.diasRestantes} días`}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-arctic-slate truncate">{p.materiaNombre}</span>
                    <span className="block text-xs text-arctic-secondary truncate">
                      {formatearFechaLocal(p.fechaParcial, { weekday: "long", day: "numeric", month: "long" })} ·{" "}
                      {p.temasPendientes === 0 ? "todo listo para repasar" : plural(p.temasPendientes, "tema pendiente", "temas pendientes")}
                    </span>
                  </span>
                  <ChevronRight size={16} className="text-arctic-tertiary shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tus materias */}
      {!sinMaterias && (
        <section aria-labelledby="materias-titulo" className="space-y-4">
          <div className="px-1">
            <h2 id="materias-titulo" className="apple-title-2 text-arctic-slate">Tus materias</h2>
            <p className="text-xs text-arctic-secondary mt-0.5">Estructura tus asignaturas y monitorea el avance de cada una</p>
          </div>

          <ListaEscalonada className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" classNameElemento="grid">
            {materias?.map((materia) => {
              const temas = materia.temas || [];
              const completedCount = temas.filter((t) => t.estado === "completado").length;
              const progressPct = temas.length > 0 ? Math.round((completedCount / temas.length) * 100) : 0;
              const dias = materia.fecha_parcial ? diasHasta(materia.fecha_parcial, hoy) : null;

              return (
                <Link
                  key={materia.id}
                  href={`/materias/${materia.id}`}
                  className="apple-card p-5 flex flex-col justify-between group apple-tactile cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-semibold text-arctic-slate tracking-tight group-hover:text-glacier-blue transition-colors">
                        {materia.nombre}
                      </h3>
                      {materia.fecha_parcial && dias !== null && dias >= 0 && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${tonoParcial(dias)}`}
                        >
                          <Calendar size={12} aria-hidden="true" />
                          <span>
                            <span className="sr-only">Parcial el </span>
                            {formatearFechaLocal(materia.fecha_parcial, { month: "short", day: "numeric" })}
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-arctic-secondary">
                      {completedCount} de {temas.length} temas completados
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-black/[0.05]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-arctic-secondary">Progreso</span>
                      <span className="font-semibold text-arctic-slate tabular-nums">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-black/[0.05] rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-glacier-blue" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </ListaEscalonada>
        </section>
      )}

      {/* Recordatorio diario: se oculta si ya está activado o si el usuario lo cerró */}
      <PushNotificationManager descartable />
    </div>
  );
}
