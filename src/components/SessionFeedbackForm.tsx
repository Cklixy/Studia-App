"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { avisar } from "@/lib/avisos";

// Grupo de opciones con radios nativos: el lector anuncia pregunta, opción y estado
// (antes eran botones sin estado y las estrellas se llamaban todas "★").
function GrupoOpciones({
  pregunta,
  nombre,
  opciones,
  valor,
  onChange,
}: {
  pregunta: string;
  nombre: string;
  opciones: string[];
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="titulo-3 mb-3">{pregunta}</legend>
      <div className="flex gap-2 flex-wrap">
        {opciones.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={nombre}
              value={opt}
              checked={valor === opt}
              onChange={() => onChange(opt)}
              className="peer sr-only"
            />
            <span className="inline-flex items-center min-h-11 px-4 border rounded-full text-sm font-medium transition border-linea-fuerte text-tinta hover:border-acento peer-checked:bg-acento peer-checked:text-sobre-acento peer-checked:border-acento peer-focus-visible:ring-2 peer-focus-visible:ring-acento peer-focus-visible:ring-offset-2">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SessionFeedbackForm({ session, elapsed, pauses }: { session: any; elapsed: number; pauses: number }) {
  const router = useRouter();
  const id = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [utilidad, setUtilidad] = useState<string>("");
  const [productividad, setProductividad] = useState<number>(0);
  const [logro, setLogro] = useState<string>("");
  // Atajo: si lograste el objetivo, el tema puede quedar como completado (endpoint existente de temas)
  const [marcarTema, setMarcarTema] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utilidad || !productividad || !logro) {
      setError("Responde las tres preguntas para guardar la sesión.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/sesiones/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tiempo_efectivo_segundos: elapsed,
          pausas_count: pauses,
          resultado_logro: logro,
          calificacion_utilidad: utilidad,
          calificacion_productividad: productividad,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.error === "string" ? d.error : "No pudimos guardar la sesión. Inténtalo de nuevo.");
      }

      let temaMarcado = false;
      if (session.tema_id && logro === "Sí" && marcarTema) {
        const r = await fetch(`/api/temas/${session.tema_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        }).catch(() => null);
        temaMarcado = !!r?.ok;
      }
      avisar(`Sesión guardada: +${xp} XP${temaMarcado ? " y tema completado" : ""}.`);
      router.push("/hoy");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const minutos = Math.floor(elapsed / 60);
  const xp = minutos * 10;
  const resumen = [
    { etiqueta: "Minutos de estudio", valor: String(minutos) },
    { etiqueta: "XP que sumas", valor: `+${xp}` },
    { etiqueta: "Pausas", valor: String(pauses) },
  ];

  return (
    <form onSubmit={handleSubmit} className="tarjeta p-4 sm:p-7 flex flex-col gap-7">
      {/* Resumen */}
      <dl className="grid grid-cols-3 gap-2">
        {resumen.map(({ etiqueta, valor }) => (
          <div key={etiqueta} className="flex flex-col-reverse rounded-2xl bg-hundido px-2 py-4 text-center">
            <dt className="text-xs font-semibold text-tinta-2 mt-2">{etiqueta}</dt>
            <dd className="font-display text-3xl leading-none text-tinta tabular-nums">{valor}</dd>
          </div>
        ))}
      </dl>
      {session.temas?.nombre && <p className="-mt-3 text-center text-sm text-tinta-2">{session.temas.nombre} · planificado {session.duracion_planificada_minutos} min</p>}

      <GrupoOpciones
        pregunta="¿Te sirvió esta sesión?"
        nombre={`${id}-utilidad`}
        opciones={["Sí mucho", "Sí", "Más o menos", "No"]}
        valor={utilidad}
        onChange={setUtilidad}
      />

      <fieldset className="space-y-3">
        <legend className="titulo-3 mb-3">¿Qué tan productiva fue?</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((estrella) => (
            <label key={estrella} className="cursor-pointer">
              <input
                type="radio"
                name={`${id}-productividad`}
                value={estrella}
                checked={productividad === estrella}
                onChange={() => setProductividad(estrella)}
                className="peer sr-only"
              />
              <span className="sr-only">{estrella} de 5</span>
              <span
                aria-hidden="true"
                className="w-11 h-11 flex items-center justify-center rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-acento"
              >
                <Star
                  size={28}
                  strokeWidth={1.75}
                  className={estrella <= productividad ? "fill-aviso text-aviso" : "text-linea-fuerte"}
                />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <GrupoOpciones
        pregunta="¿Lograste tu objetivo?"
        nombre={`${id}-logro`}
        opciones={["Sí", "Parcialmente", "No"]}
        valor={logro}
        onChange={setLogro}
      />

      {session.tema_id && logro === "Sí" && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl bg-exito-suave px-4 py-3 text-sm font-semibold text-exito">
          <input type="checkbox" checked={marcarTema} onChange={(e) => setMarcarTema(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--exito))]" />
          Marcar «{session.temas?.nombre}» como completado
        </label>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-error-suave px-4 py-3 text-sm font-semibold text-error">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primario w-full text-base min-h-14">
        {loading && <Loader2 aria-hidden="true" size={20} className="animate-spin" />}
        {loading ? "Guardando…" : "Guardar sesión"}
      </button>
    </form>
  );
}
