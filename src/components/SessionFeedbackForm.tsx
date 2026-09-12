"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionFeedbackForm({ session, elapsed, pauses }: { session: any, elapsed: number, pauses: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [utilidad, setUtilidad] = useState<string>("");
  const [productividad, setProductividad] = useState<number>(0);
  const [logro, setLogro] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utilidad || !productividad || !logro) {
      setError("Por favor completa todas las preguntas.");
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
          calificacion_productividad: productividad
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error al guardar el feedback");
      }

      router.push("/materias");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatMinutes = (seconds: number) => {
    return Math.floor(seconds / 60);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-elevated p-8 space-y-8">
      {/* Resumen de Datos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-sm opacity-50 uppercase tracking-wide">Materia</span>
          <strong className="text-lg">{session.materias?.nombre}</strong>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-sm opacity-50 uppercase tracking-wide">Tiempo Efectivo</span>
          <strong className="text-lg">{formatMinutes(elapsed)} min</strong>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-sm opacity-50 uppercase tracking-wide">Planificado</span>
          <strong className="text-lg">{session.duracion_planificada_minutos} min</strong>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center">
          <span className="block text-sm opacity-50 uppercase tracking-wide">Pausas</span>
          <strong className="text-lg">{pauses}</strong>
        </div>
      </div>

      {error && <div className="text-red-500 bg-red-500/10 p-4 rounded">{error}</div>}

      <div className="space-y-4">
        <h3 className="text-xl font-bold">¿Te sirvió esta sesión?</h3>
        <div className="flex gap-2 flex-wrap">
          {["Sí mucho", "Sí", "Más o menos", "No"].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setUtilidad(opt)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition ${utilidad === opt ? 'bg-electric-periwinkle text-deep-ink border-electric-periwinkle' : 'border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">¿Qué tan productiva fue tu sesión?</h3>
        <div className="flex gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setProductividad(star)}
              className={`transition ${star <= productividad ? 'text-yellow-500 hover:scale-110' : 'text-foreground/20 hover:text-foreground/40'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">¿Lograste tu objetivo?</h3>
        <div className="flex gap-2">
          {["Sí", "Parcialmente", "No"].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setLogro(opt)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition ${logro === opt ? 'bg-electric-periwinkle text-deep-ink border-electric-periwinkle' : 'border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !utilidad || !productividad || !logro}
        className="btn-action w-full justify-center disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? "Guardando..." : "Guardar y finalizar"}
      </button>
    </form>
  );
}
