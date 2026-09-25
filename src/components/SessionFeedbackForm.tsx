"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

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
      <legend className="text-lg sm:text-xl font-bold text-arctic-slate mb-3">{pregunta}</legend>
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
            <span className="inline-flex items-center min-h-11 px-4 border rounded-full text-sm font-medium transition border-arctic-borde text-arctic-slate hover:border-glacier-blue peer-checked:bg-glacier-blue peer-checked:text-white peer-checked:border-glacier-blue peer-focus-visible:ring-2 peer-focus-visible:ring-glacier-blue peer-focus-visible:ring-offset-2">
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

      router.push("/materias");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="apple-card p-4 sm:p-8 space-y-7 sm:space-y-8">

      <GrupoOpciones
        pregunta="¿Te sirvió esta sesión?"
        nombre={`${id}-utilidad`}
        opciones={["Sí mucho", "Sí", "Más o menos", "No"]}
        valor={utilidad}
        onChange={setUtilidad}
      />

      <fieldset className="space-y-3">
        <legend className="text-lg sm:text-xl font-bold text-arctic-slate mb-3">¿Qué tan productiva fue tu sesión?</legend>
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
                className="w-11 h-11 flex items-center justify-center rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-glacier-blue"
              >
                <Star
                  size={28}
                  strokeWidth={1.75}
                  className={estrella <= productividad ? "fill-amber-400 text-amber-600" : "text-arctic-borde"}
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

      {error && (
        <div role="alert" className="text-cool-berry bg-cool-berry/10 border border-cool-berry/20 p-3.5 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-action w-full justify-center min-h-11 disabled:opacity-50 disabled:hover:scale-100">
        {loading ? "Guardando…" : "Guardar y finalizar"}
      </button>
    </form>
  );
}
