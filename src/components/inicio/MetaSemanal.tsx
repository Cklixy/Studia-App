"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import Hoja from "@/components/ui/Hoja";
import { guardarMetaSemanal } from "@/app/actions/meta";

const OPCIONES_MIN = [120, 240, 360, 480, 600];

function horas(min: number) {
  return `${min / 60} h`;
}

/**
 * Botón para fijar la meta semanal de estudio. Se guarda en los metadatos del usuario de Supabase
 * (user_metadata.meta_semanal_minutos) con una server action: no es un dato sensible y no requiere
 * una migración.
 */
export default function MetaSemanal({ meta }: { meta: number | null }) {
  const router = useRouter();
  const [abierta, setAbierta] = useState(false);
  const [guardando, setGuardando] = useState<number | "ninguna" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guardar = async (valor: number | null) => {
    setGuardando(valor ?? "ninguna");
    setError(null);
    const { ok } = await guardarMetaSemanal(valor).catch(() => ({ ok: false }));
    setGuardando(null);
    if (!ok) {
      setError("No pudimos guardar tu meta. Inténtalo de nuevo.");
      return;
    }
    setAbierta(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
        className="btn-apple-ghost text-xs min-h-11 -mx-2 apple-tactile"
      >
        <Target size={14} aria-hidden="true" />
        <span>{meta ? "Cambiar meta" : "Fijar meta semanal"}</span>
      </button>

      <Hoja
        abierto={abierta}
        onCerrar={() => setAbierta(false)}
        titulo="Meta de estudio semanal"
        descripcion="Horas efectivas de lunes a domingo. Puedes cambiarla cuando quieras."
      >
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">
            {error}
          </div>
        )}
        <div role="group" aria-label="Horas por semana" className="grid grid-cols-3 gap-2">
          {OPCIONES_MIN.map((min) => (
            <button
              key={min}
              type="button"
              aria-pressed={meta === min}
              disabled={guardando !== null}
              onClick={() => guardar(min)}
              data-autofocus={meta === min || (!meta && min === 240) ? true : undefined}
              className={`min-h-12 rounded-2xl border text-sm font-semibold apple-tactile transition-colors disabled:opacity-60 ${
                meta === min
                  ? "bg-glacier-blue text-white border-glacier-blue"
                  : "bg-white text-arctic-slate border-black/[0.08] hover:bg-black/[0.03]"
              }`}
            >
              {guardando === min ? "Guardando…" : horas(min)}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={!meta}
            disabled={guardando !== null}
            onClick={() => guardar(null)}
            className="min-h-12 rounded-2xl border border-black/[0.08] bg-white text-sm font-semibold text-arctic-secondary hover:bg-black/[0.03] apple-tactile disabled:opacity-60"
          >
            {guardando === "ninguna" ? "Guardando…" : "Sin meta"}
          </button>
        </div>
      </Hoja>
    </>
  );
}
