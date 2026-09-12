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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header>
        <div className="flex items-center gap-3 text-signal-lime mb-2">
          <Trophy size={24} />
          <h1 className="text-3xl font-display font-bold text-text-primary">Mis Logros</h1>
        </div>
        <p className="text-text-secondary">Insignias desbloqueadas y metas por alcanzar.</p>
      </header>

      {/* Nivel actual */}
      <div className="surface-panel p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-electric-lavender/10 border-2 border-electric-lavender flex items-center justify-center font-display text-2xl font-bold text-electric-lavender">
          {racha?.nivel_actual || 1}
        </div>
        <div>
          <p className="text-sm text-text-secondary uppercase tracking-widest font-bold">Nivel Actual</p>
          <p className="text-xl font-display font-bold">{racha?.xp_total || 0} XP totales</p>
          <p className="text-sm text-text-secondary">{racha?.dias || 0} días de racha activos</p>
        </div>
      </div>

      {/* Grid de badges */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Insignias de Racha</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = badgesDesbloqueados.has(`¡Racha de ${badge.milestone} días lograda!`);
            return (
              <div
                key={badge.id}
                className={`surface-panel p-5 flex flex-col items-center text-center gap-3 transition-all ${isUnlocked ? 'border-signal-lime/20' : 'opacity-40'}`}
              >
                <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>{badge.emoji}</div>
                <div>
                  <p className="font-display font-bold text-sm">{badge.nombre}</p>
                  <p className="text-xs text-text-secondary mt-1">{badge.descripcion}</p>
                </div>
                {!isUnlocked && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Lock size={10} /> Bloqueado
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
