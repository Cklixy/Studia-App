import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Trophy, Lock } from "lucide-react";

// Lista completa de badges posibles en el juego
const ALL_BADGES = [
  { id: "racha_3", nombre: "Primer Ritmo", descripcion: "3 días de racha consecutivos", emoji: "🔥", milestone: 3 },
  { id: "racha_7", nombre: "Una Semana Exacta", descripcion: "7 días de racha consecutivos", emoji: "⚡", milestone: 7 },
  { id: "racha_14", nombre: "Dos Semanas", descripcion: "14 días de racha consecutivos", emoji: "🌟", milestone: 14 },
  { id: "racha_30", nombre: "El Mensual", descripcion: "30 días de racha consecutivos", emoji: "🏆", milestone: 30 },
  { id: "racha_50", nombre: "Imparable", descripcion: "50 días de racha consecutivos", emoji: "💎", milestone: 50 },
  { id: "racha_100", nombre: "Leyenda", descripcion: "100 días de racha consecutivos", emoji: "👑", milestone: 100 },
];

export default async function LogrosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Leer recompensas desbloqueadas
  const { data: recompensas } = await supabase
    .from("recompensas")
    .select("descripcion, created_at")
    .eq("user_id", user.id)
    .eq("desbloqueado", true);

  // Leer datos de racha actual para mostrar progreso
  const { data: racha } = await supabase
    .from("rachas")
    .select("dias, xp_total, nivel_actual")
    .eq("user_id", user.id)
    .single();

  // Mapear qué badges están desbloqueados basándose en la descripción guardada
  const badgesDesbloqueados = new Set(
    (recompensas || []).map(r => r.descripcion)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="pb-2 border-b border-black/[0.06]">
        <span className="text-[11px] font-semibold text-arctic-tertiary uppercase tracking-wider">
          Gamificación y Metas
        </span>
        <div className="flex items-center gap-2.5 mt-0.5">
          <Trophy size={26} className="text-glacier-blue" />
          <h1 className="text-3xl font-bold tracking-tight text-arctic-slate">Mis Logros</h1>
        </div>
        <p className="text-xs text-arctic-secondary mt-1">Insignias desbloqueadas y metas de constancia académica.</p>
      </header>

      {/* Nivel actual */}
      <div className="apple-card p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white/95 border border-black/[0.08] shadow-apple-sm text-center sm:text-left">
        <div className="w-16 h-16 rounded-2xl bg-cool-iris/10 border-2 border-cool-iris/30 flex items-center justify-center font-display text-2xl font-bold text-cool-iris shrink-0 shadow-apple-sm">
          {racha?.nivel_actual || 1}
        </div>
        <div>
          <p className="text-[11px] text-arctic-secondary uppercase tracking-wider font-semibold">Nivel Académico</p>
          <p className="text-xl font-bold text-arctic-slate tabular-nums">{racha?.xp_total || 0} XP acumulados</p>
          <p className="text-xs text-arctic-secondary mt-0.5">{racha?.dias || 0} días de racha activa</p>
        </div>
      </div>

      {/* Grid de badges */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-arctic-slate tracking-tight">Insignias de Racha</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {ALL_BADGES.map(badge => {
            const isUnlocked = badgesDesbloqueados.has(`¡Racha de ${badge.milestone} días lograda!`);
            return (
              <div
                key={badge.id}
                className={`apple-card p-5 flex flex-col items-center text-center gap-3 transition-all ${
                  isUnlocked 
                    ? 'bg-white/95 border-glacier-blue/30 shadow-apple-sm' 
                    : 'bg-frost-base/50 border-black/[0.06] opacity-50'
                }`}
              >
                <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>{badge.emoji}</div>
                <div>
                  <p className="font-bold text-sm text-arctic-slate tracking-tight">{badge.nombre}</p>
                  <p className="text-xs text-arctic-secondary mt-1 leading-relaxed">{badge.descripcion}</p>
                </div>
                {!isUnlocked && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-arctic-tertiary">
                    <Lock size={11} /> 
                    <span>Bloqueado</span>
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
