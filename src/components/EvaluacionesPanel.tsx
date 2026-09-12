"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

type Evaluacion = {
  id: string;
  nombre: string;
  porcentaje: number;
  nota_obtenida: number | null;
};

export default function EvaluacionesPanel({ materiaId }: { materiaId: string }) {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [nota, setNota] = useState("");

  const fetchEvaluaciones = async () => {
    setLoading(true);
    const res = await fetch(`/api/materias/${materiaId}/evaluaciones`);
    if (res.ok) {
      const data = await res.json();
      setEvaluaciones(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluaciones();
  }, [materiaId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const p = parseFloat(porcentaje);
    const n = nota ? parseFloat(nota) : null;

    const res = await fetch(`/api/materias/${materiaId}/evaluaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        porcentaje: p,
        nota_obtenida: n,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.error || "Error al agregar la evaluación");
      return;
    }

    setNombre("");
    setPorcentaje("");
    setNota("");
    fetchEvaluaciones();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Borrar esta evaluación?")) return;
    await fetch(`/api/evaluaciones/${id}`, { method: "DELETE" });
    fetchEvaluaciones();
  };

  const porcentajeTotal = evaluaciones.reduce((sum, ev) => sum + Number(ev.porcentaje), 0);
  
  // Cálculo de nota acumulada
  // Si tengo Parcial 1 (30%) con nota 4.0, la nota acumulada aportada es 4.0 * 0.3 = 1.2
  const acumuladaAportada = evaluaciones.reduce((sum, ev) => {
    if (ev.nota_obtenida !== null && ev.nota_obtenida !== undefined) {
      return sum + (Number(ev.nota_obtenida) * (Number(ev.porcentaje) / 100));
    }
    return sum;
  }, 0);

  // Nota actual sobre el porcentaje evaluado
  // Ej: Llevo 1.2 acumulado en el 30% evaluado -> Mi nota real es 1.2 / 0.3 = 4.0
  const notaActualSobreEvaluado = porcentajeTotal > 0 ? (acumuladaAportada / (porcentajeTotal / 100)) : 0;

  // Cuánto necesito en el porcentaje restante para llegar a 3.0 (aprobación)
  const porcentajeRestante = 100 - porcentajeTotal;
  const notaFaltanteParaAprobar = 3.0 - acumuladaAportada;
  
  let notaNecesaria = 0;
  if (porcentajeRestante > 0) {
    notaNecesaria = notaFaltanteParaAprobar / (porcentajeRestante / 100);
  }

  if (loading) return <div className="animate-pulse h-32 surface-panel mt-8"></div>;

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-display text-2xl font-bold mb-6">Gestión de Calificaciones</h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="surface-elevated p-6 text-center flex flex-col justify-center border-l-4 border-l-electric-periwinkle">
          <span className="block text-xs uppercase font-bold tracking-widest text-text-secondary">Porcentaje Evaluado</span>
          <span className="block text-4xl font-display font-bold mt-2 text-electric-periwinkle">{porcentajeTotal}%</span>
        </div>
        <div className="surface-elevated p-6 text-center flex flex-col justify-center border-l-4 border-l-signal-lime">
          <span className="block text-xs uppercase font-bold tracking-widest text-text-secondary">Nota Acumulada</span>
          <span className="block text-4xl font-display font-bold mt-2 text-signal-lime">{notaActualSobreEvaluado.toFixed(2)}</span>
          <span className="block text-xs text-text-secondary mt-1">sobre el {porcentajeTotal}%</span>
        </div>
        <div className="surface-elevated p-6 text-center flex flex-col justify-center border-l-4 border-l-warm-coral">
          <span className="block text-xs uppercase font-bold tracking-widest text-text-secondary">Para aprobar (3.0)</span>
          {porcentajeRestante === 0 ? (
            <span className="block text-xl font-bold mt-2 text-signal-lime">¡Aprobaste! 🎉</span>
          ) : notaNecesaria > 5.0 ? (
            <span className="block text-xl font-bold mt-2 text-warm-coral">Matemáticamente imposible</span>
          ) : notaNecesaria <= 0 ? (
            <span className="block text-xl font-bold mt-2 text-signal-lime">Ya aprobaste</span>
          ) : (
            <span className="block text-3xl font-display font-bold mt-2 text-warm-coral">
              {notaNecesaria.toFixed(2)}
            </span>
          )}
          {porcentajeRestante > 0 && <span className="block text-xs text-text-secondary mt-1">en el {porcentajeRestante}% restante</span>}
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-10 items-end surface-panel p-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Nombre de la evaluación</label>
          <input required type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Primer Parcial" className="w-full bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors" />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Peso (%)</label>
          <input required type="number" step="0.1" min="0.1" max="100" value={porcentaje} onChange={e => setPorcentaje(e.target.value)} placeholder="30" className="w-full bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors" />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Nota (0-5)</label>
          <input type="number" step="0.1" min="0" max="5" value={nota} onChange={e => setNota(e.target.value)} placeholder="Opcional" className="w-full bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors" />
        </div>
        <button type="submit" disabled={porcentajeTotal >= 100} className="w-full md:w-auto btn-action py-3 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none">
          Agregar
        </button>
      </form>

      {error && <p className="text-warm-coral text-sm mb-4 bg-warm-coral/10 p-3 rounded-xl border border-warm-coral/20 font-medium">{error}</p>}

      <div className="space-y-3">
        {evaluaciones.length === 0 ? (
          <div className="surface-panel p-8 text-center text-text-secondary italic">
            No has registrado calificaciones para esta materia.
          </div>
        ) : (
          evaluaciones.map(ev => (
            <div key={ev.id} className="surface-panel p-5 flex justify-between items-center group hover:border-white/10 transition-colors">
              <div>
                <span className="font-semibold text-[15px]">{ev.nombre}</span>
                <span className="text-sm text-text-secondary ml-3 bg-white/5 px-2 py-1 rounded-md">{ev.porcentaje}%</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-display font-bold text-xl">{ev.nota_obtenida !== null ? Number(ev.nota_obtenida).toFixed(1) : "-"}</span>
                <button onClick={() => handleDelete(ev.id)} className="text-text-secondary hover:text-warm-coral transition-colors p-2 rounded-lg hover:bg-warm-coral/10">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
