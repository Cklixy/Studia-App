import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Flame, Zap, Star, Trophy, Gem, Crown, Check, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import NavProgreso from "@/components/NavProgreso";
import BarraProgreso from "@/components/ui/BarraProgreso";
import { rachaVigente, xpInicioNivel, XP_POR_MINUTO } from "@/lib/racha";
import { plural } from "@/lib/texto";

export const metadata: Metadata = { title: "Logros · studia+" };

// Insignias por racha (las mismas reglas de siempre; solo cambia la presentación)
const INSIGNIAS = [
  { id: "racha_3", nombre: "Primer ritmo", meta: 3, icono: Flame },
  { id: "racha_7", nombre: "Una semana", meta: 7, icono: Zap },
  { id: "racha_14", nombre: "Dos semanas", meta: 14, icono: Star },
  { id: "racha_30", nombre: "Un mes", meta: 30, icono: Trophy },
  { id: "racha_50", nombre: "Imparable", meta: 50, icono: Gem },
  { id: "racha_100", nombre: "Leyenda", meta: 100, icono: Crown },
];

// Progreso · Logros (rediseño 4.6, principio 6): celebra lo conseguido y muestra el siguiente paso
// alcanzable; lo bloqueado dice cuánto falta en vez de «Bloqueado».
export default async function LogrosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const [{ data: recompensas }, { data: racha }] = await Promise.all([
    supabase.from("recompensas").select("descripcion, created_at").eq("user_id", user.id).eq("desbloqueado", true),
    supabase.from("rachas").select("dias, xp_total, nivel_actual, ultima_actividad").eq("user_id", user.id).maybeSingle(),
  ]);

  const logradas = new Set((recompensas || []).map((r) => r.descripcion));
  const dias = rachaVigente(racha);
  const nivel = racha?.nivel_actual || 1;
  const xp = racha?.xp_total || 0;
  const inicio = xpInicioNivel(nivel);
  const siguiente = xpInicioNivel(nivel + 1);
  const pct = Math.min(100, Math.round(((xp - inicio) / (siguiente - inicio)) * 100));
  const conseguida = (meta: number) => logradas.has(`¡Racha de ${meta} días lograda!`);
  const proxima = INSIGNIAS.find((i) => !conseguida(i.meta));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="titulo-1">Progreso</h1>
        <NavProgreso activo="logros" />
      </header>

      <section aria-labelledby="titulo-nivel" className="tarjeta p-5 sm:p-6 flex items-center gap-5">
        <div className="shrink-0 w-20 h-20 rounded-3xl bg-acento-suave flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-acento">Nivel</span>
          <span className="font-display text-4xl leading-none text-acento">{nivel}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="titulo-nivel" className="titulo-3 tabular-nums">{xp} XP</h2>
          <p className="text-sm text-tinta-2">{dias > 0 ? `${plural(dias, "día seguido", "días seguidos")} estudiando` : "Tu racha empieza con la próxima sesión"}</p>
          <BarraProgreso valor={pct} etiqueta={`Progreso hacia el nivel ${nivel + 1}`} textoValor={`Faltan ${Math.max(0, siguiente - xp)} XP`} className="mt-3" />
          <p className="text-xs text-tinta-2 mt-1.5">Faltan {Math.max(0, siguiente - xp)} XP para el nivel {nivel + 1} (≈ {Math.ceil(Math.max(0, siguiente - xp) / XP_POR_MINUTO)} min de estudio)</p>
        </div>
      </section>

      {proxima && (
        <section aria-labelledby="titulo-proxima" className="rounded-2xl border-2 border-acento/30 bg-acento-suave p-5 flex items-center gap-4">
          <span className="shrink-0 w-14 h-14 rounded-2xl bg-superficie text-acento flex items-center justify-center">
            <proxima.icono aria-hidden="true" size={28} />
          </span>
          <div>
            <h2 id="titulo-proxima" className="text-sm font-semibold text-acento">Tu próxima insignia</h2>
            <p className="titulo-3">{proxima.nombre}</p>
            <p className="text-sm text-tinta-2">
              {proxima.meta - dias > 0 ? `Te ${proxima.meta - dias === 1 ? "falta 1 día" : `faltan ${proxima.meta - dias} días`} seguidos.` : "¡La consigues con tu próxima sesión!"}
            </p>
          </div>
        </section>
      )}

      <section aria-labelledby="titulo-insignias" className="flex flex-col gap-3">
        <h2 id="titulo-insignias" className="titulo-2">Insignias</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INSIGNIAS.map(({ id, nombre, meta, icono: Icono }) => {
            const ok = conseguida(meta);
            return (
              <li key={id} className={`tarjeta p-4 flex flex-col items-center text-center gap-2 ${ok ? "" : "bg-fondo border-dashed"}`}>
                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ok ? "bg-resaltador text-sobre-resaltador" : "bg-hundido text-tinta-3"}`}>
                  <Icono aria-hidden="true" size={24} />
                </span>
                <p className="encabezado">{nombre}</p>
                <p className="text-sm text-tinta-2">{meta} días seguidos</p>
                {ok ? (
                  <span className="chip chip-exito"><Check aria-hidden="true" size={14} />Conseguida</span>
                ) : (
                  <span className="chip">Faltan {Math.max(1, meta - dias)} días</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <details className="tarjeta p-5 group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 titulo-3 [&::-webkit-details-marker]:hidden">
          Cómo funciona tu progreso
          <ChevronDown aria-hidden="true" size={20} className="text-tinta-2 transition-transform duration-media group-open:rotate-180" />
        </summary>
        <ul className="mt-3 flex flex-col gap-2 text-tinta list-disc pl-5">
          <li><strong>XP:</strong> {XP_POR_MINUTO} XP por cada minuto de estudio efectivo (sin pausas) al terminar una sesión.</li>
          <li><strong>Nivel:</strong> nivel 2 con 100 XP, nivel 3 con 400 XP, nivel 4 con 900 XP…</li>
          <li><strong>Racha:</strong> suma un día cada día (hora de Colombia) en que termines al menos una sesión.</li>
          <li><strong>Si un día no estudias:</strong> la racha vuelve a empezar, pero tu XP, tu nivel y tus insignias se quedan contigo. Retomar cuenta más que no fallar nunca.</li>
        </ul>
      </details>
    </div>
  );
}
