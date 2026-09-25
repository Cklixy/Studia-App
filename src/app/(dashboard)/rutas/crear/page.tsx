"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ChevronLeft, Loader2 } from "lucide-react";

export default function CrearRutaIAPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [nivelEducativo, setNivelEducativo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tiempoDiario, setTiempoDiario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generar-ruta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          nivelEducativo,
          objetivo,
          tiempoDiario
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        // El fallo casi nunca es culpa de la petición: no pedir "ser más específico"
        throw new Error(
          d.codigo === "IA_SATURADA"
            ? "La IA está saturada en este momento. Tu texto se conservó: vuelve a pulsar «Crear plan» en unos segundos."
            : res.status === 429
              ? d.error || "Alcanzaste el límite de rutas por hora. Inténtalo más tarde."
              : "No pudimos generar la ruta. Revisa tu conexión e inténtalo de nuevo."
        );
      }

      const data = await res.json();
      
      // Store the generated route in localStorage to pass it to the preview screen
      localStorage.setItem("studia_pending_route", JSON.stringify({
        ...data,
        prompt_original: prompt
      }));
      
      router.push("/rutas/preview");

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const selectores = [
    { id: "ruta-nivel", etiqueta: "Nivel", valor: nivelEducativo, fijar: setNivelEducativo, opciones: [["Colegio", "Colegio"], ["Universidad", "Universidad"], ["Técnico / Tecnológico", "Técnico o tecnológico"], ["Aprendizaje Personal", "Por mi cuenta"]] },
    { id: "ruta-objetivo", etiqueta: "Objetivo", valor: objetivo, fijar: setObjetivo, opciones: [["Aprender desde cero", "Aprender desde cero"], ["Prepararme para un parcial", "Preparar un parcial"], ["Repasar conceptos", "Repasar"], ["Profundizar en el tema", "Profundizar"]] },
    { id: "ruta-tiempo", etiqueta: "Tiempo al día", valor: tiempoDiario, fijar: setTiempoDiario, opciones: [["15 minutos al día", "15 min"], ["30 minutos al día", "30 min"], ["1 hora al día", "1 hora"], ["2+ horas al día", "2 horas o más"]] },
  ] as const;

  // Plan con IA (rediseño 4.2): una pregunta abierta y lo demás opcional y plegado.
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <Link href="/materias" className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-tinta-2 hover:text-tinta">
          <ChevronLeft aria-hidden="true" size={18} /> Materias
        </Link>
        <h1 className="titulo-1 mt-2">Plan con IA</h1>
        <p className="subtitulo mt-1.5">Cuéntale qué tienes que aprender y la IA arma una materia con sus temas en orden. Puedes revisarlo antes de guardarlo.</p>
      </div>

      <form onSubmit={handleSubmit} aria-busy={loading} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ruta-peticion" className="text-sm font-semibold">¿Qué necesitas aprender?</label>
          <textarea
            id="ruta-peticion"
            required
            autoFocus
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej. Tengo parcial de cálculo diferencial sobre límites el viernes"
            className="campo resize-y text-lg"
          />
        </div>

        <details className="rounded-2xl border border-linea bg-superficie px-4">
          <summary className="flex min-h-12 cursor-pointer items-center font-semibold text-tinta-2">Afinar el plan (opcional)</summary>
          <div className="grid gap-3 pb-4 sm:grid-cols-3">
            {selectores.map((s) => (
              <div key={s.id} className="flex flex-col gap-1.5">
                <label htmlFor={s.id} className="text-sm font-semibold">{s.etiqueta}</label>
                <select id={s.id} value={s.valor} onChange={(e) => s.fijar(e.target.value)} className="campo">
                  <option value="">Sin preferencia</option>
                  {s.opciones.map(([v, e]) => <option key={v} value={v}>{e}</option>)}
                </select>
              </div>
            ))}
          </div>
        </details>

        {error && <p role="alert" className="rounded-xl bg-error-suave px-4 py-3 text-sm font-semibold text-error">{error}</p>}

        <button type="submit" disabled={loading || !prompt.trim()} className="btn-primario text-base min-h-12 sm:self-start">
          {loading ? <Loader2 aria-hidden="true" size={18} className="animate-spin" /> : <Sparkles aria-hidden="true" size={18} />}
          {loading ? "Armando tu plan… (unos segundos)" : "Crear plan"}
        </button>
        {loading && <p role="status" className="text-sm text-tinta-2">La IA está ordenando los temas. No cierres esta pantalla.</p>}
      </form>
    </div>
  );
}
