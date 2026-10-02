import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Lock, Flame, Trophy, CheckCircle2 } from "lucide-react";
import NavProgreso from "@/components/NavProgreso";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import CalendarioRacha from "@/components/CalendarioRacha";
import { obtenerDiasProtegidos, obtenerEstadoProtectores } from "@/lib/protectores";
import { INSIGNIAS } from "@/lib/insignias";
import { fechasDeActividad, mejorRacha, mesValido, rachaVigente, xpInicioNivel, XP_POR_MINUTO } from "@/lib/racha";

export default async function LogrosPage({ searchParams }: { searchParams: { mes?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Leer recompensas desbloqueadas y datos de racha en paralelo
  const [
    { data: recompensas },
    { data: racha },
    { data: sesionesFinalizadas },
    protectores,
    diasProtegidos
  ] = await Promise.all([
    supabase
      .from("recompensas")
      .select("descripcion, created_at")
      .eq("user_id", user.id)
      .eq("desbloqueado", true),
    supabase
      .from("rachas")
      .select("dias, xp_total, nivel_actual, ultima_actividad")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("sesiones")
      .select("hora_finalizacion")
      .eq("user_id", user.id)
      .eq("estado", "finalizada")
      .not("hora_finalizacion", "is", null)
      .order("hora_finalizacion", { ascending: false })
      .limit(5000),
    obtenerEstadoProtectores(supabase),
    obtenerDiasProtegidos(supabase, user.id, "2000-01-01")
  ]);

  const estudiados = fechasDeActividad((sesionesFinalizadas || []).map((s) => s.hora_finalizacion));
  const mes = mesValido(searchParams.mes);
  const rachaActual = rachaVigente(racha, protectores?.disponibles ?? 0);
  const mejor = Math.max(mejorRacha(estudiados), racha?.dias || 0);

  // Mapear qué badges están desbloqueados basándose en la descripción guardada
  const badgesDesbloqueados = new Set(
    (recompensas || []).map(r => r.descripcion)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <NavProgreso activo="logros" />
      <EncabezadoPantalla
        etiqueta="Progreso"
        titulo="Mis logros"
        descripcion="Insignias desbloqueadas y metas de constancia académica."
      />

      {/* Racha: actual, mejor y calendario del mes */}
      <section aria-label="Tu racha" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="apple-card p-4 sm:p-5 flex items-center gap-3">
            <Flame size={28} className={rachaActual > 0 ? "text-cool-berry fill-cool-berry" : "text-arctic-tertiary"} aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold tracking-tight text-arctic-slate tabular-nums">{rachaActual}</p>
              <p className="text-xs text-arctic-secondary">{rachaActual === 1 ? "día de racha" : "días de racha"}</p>
            </div>
          </div>
          <div className="apple-card p-4 sm:p-5 flex items-center gap-3">
            <Trophy size={28} className="text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold tracking-tight text-arctic-slate tabular-nums">{mejor}</p>
              <p className="text-xs text-arctic-secondary">{mejor === 1 ? "día, tu mejor racha" : "días, tu mejor racha"}</p>
            </div>
          </div>
        </div>
        <CalendarioRacha mes={mes} estudiados={estudiados} protegidos={diasProtegidos} />
      </section>

      {/* Nivel actual */}
      <div className="apple-card p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-apple-sm text-center sm:text-left">
        <div className="w-16 h-16 rounded-2xl bg-glacier-blue/10 border-2 border-glacier-blue/30 flex items-center justify-center font-display text-2xl font-bold text-glacier-blue shrink-0 shadow-apple-sm">
          {racha?.nivel_actual || 1}
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-arctic-secondary">Nivel académico</p>
          <p className="apple-title-2 text-arctic-slate tabular-nums mt-0.5">{racha?.xp_total || 0} XP acumulados</p>
          <p className="apple-subhead text-xs text-arctic-secondary mt-0.5">{rachaActual === 1 ? "1 día" : `${rachaActual} días`} de racha activa</p>
          {(() => {
            const nivel = racha?.nivel_actual || 1;
            const xp = racha?.xp_total || 0;
            const inicio = xpInicioNivel(nivel);
            const siguiente = xpInicioNivel(nivel + 1);
            const pct = Math.min(100, Math.round(((xp - inicio) / (siguiente - inicio)) * 100));
            return (
              <div className="mt-3 w-full sm:w-72">
                <div className="flex justify-between text-xs text-arctic-secondary mb-1">
                  <span>Nivel {nivel + 1}</span>
                  <span>Faltan {Math.max(0, siguiente - xp)} XP</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`Progreso hacia el nivel ${nivel + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  className="h-2 rounded-full bg-black/[0.06] overflow-hidden"
                >
                  <div className="h-full bg-glacier-blue rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Cómo funciona (antes no se explicaba en ninguna pantalla — auditoría U-13) */}
      <section className="apple-card p-5 sm:p-6 shadow-apple-sm">
        <h2 className="apple-title-3 mb-3">Cómo funciona tu progreso</h2>
        <ul className="space-y-2 text-sm text-arctic-slate list-disc pl-5">
          <li><strong>XP:</strong> ganas {XP_POR_MINUTO} XP por cada minuto de estudio efectivo (sin contar pausas) al finalizar una sesión.</li>
          <li><strong>Nivel:</strong> subes de nivel al acumular XP (nivel 2 con 100 XP, nivel 3 con 400 XP, nivel 4 con 900 XP…).</li>
          <li><strong>Racha:</strong> suma un día cada día (hora de Colombia) en que termines al menos una sesión. Si un día no estudias, un protector (1 al mes en Free, 3 en Pro) la salva solo; si no te quedan, vuelve a empezar. Tu XP y tus insignias no se pierden.</li>
          <li><strong>Insignias:</strong> se desbloquean al llegar a 3, 7, 14, 30, 50 y 100 días de racha.</li>
        </ul>
      </section>

      {/* Grid de badges */}
      <section className="space-y-4">
        <h2 className="apple-title-3">Insignias de racha</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {INSIGNIAS.map(badge => {
            const isUnlocked = badgesDesbloqueados.has(`¡Racha de ${badge.milestone} días lograda!`);
            return (
              <div
                key={badge.id}
                className={`apple-card p-3.5 sm:p-5 flex flex-col items-center text-center gap-2.5 sm:gap-3 transition-all ${
                  isUnlocked
                    ? 'border-glacier-blue/30 shadow-apple-sm'
                    : 'bg-frost-base/50 border-dashed border-black/[0.12]'
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isUnlocked ? "bg-glacier-blue text-white shadow-apple-glow" : "bg-black/[0.04] text-arctic-tertiary"
                  }`}
                >
                  <badge.icono size={26} strokeWidth={2} />
                </div>
                <div>
                  <p className="apple-headline">{badge.nombre}</p>
                  <p className="apple-subhead text-xs text-arctic-secondary mt-1 leading-relaxed">{badge.descripcion}</p>
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <CheckCircle2 size={12} strokeWidth={2} aria-hidden="true" />
                    <span>Desbloqueada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-medium text-arctic-secondary">
                    <Lock size={12} strokeWidth={2} aria-hidden="true" />
                    <span>Bloqueada</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
