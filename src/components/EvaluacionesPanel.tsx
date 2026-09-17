"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Award, AlertCircle, CheckCircle2 } from "lucide-react";

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
  
  const acumuladaAportada = evaluaciones.reduce((sum, ev) => {
    if (ev.nota_obtenida !== null && ev.nota_obtenida !== undefined) {
      return sum + (Number(ev.nota_obtenida) * (Number(ev.porcentaje) / 100));
    }
    return sum;
  }, 0);

  const notaActualSobreEvaluado = porcentajeTotal > 0 ? (acumuladaAportada / (porcentajeTotal / 100)) : 0;

  const porcentajeRestante = 100 - porcentajeTotal;
  const notaFaltanteParaAprobar = 3.0 - acumuladaAportada;
  
  let notaNecesaria = 0;
  if (porcentajeRestante > 0) {
    notaNecesaria = notaFaltanteParaAprobar / (porcentajeRestante / 100);
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 apple-card" />
          <div className="h-28 apple-card" />
          <div className="h-28 apple-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Tarjetas de métricas estilo Apple Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
        
        {/* Porcentaje evaluado */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Porcentaje Evaluado</span>
            <span className="text-[11px] font-semibold text-glacier-blue">{100 - porcentajeTotal}% restante</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-arctic-slate tabular-nums">{porcentajeTotal}%</span>
            <span className="text-xs text-arctic-secondary">/ 100%</span>
          </div>
          <div className="mt-3 w-full bg-black/[0.05] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-glacier-blue rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, porcentajeTotal)}%` }}
            />
          </div>
        </div>

        {/* Nota acumulada */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Nota Acumulada</span>
            <div className="w-6 h-6 rounded-lg bg-polar-cyan/10 text-polar-cyan flex items-center justify-center">
              <Award size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-arctic-slate tabular-nums">
              {notaActualSobreEvaluado.toFixed(2)}
            </span>
            <span className="text-xs text-arctic-secondary">/ 5.0</span>
          </div>
          <div className="text-[11px] text-arctic-tertiary mt-2">
            Ponderada sobre el {porcentajeTotal}% calificado
          </div>
        </div>

        {/* Requerimiento para aprobar */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Para Aprobar (3.0)</span>
            {porcentajeRestante === 0 || notaNecesaria <= 0 ? (
              <CheckCircle2 size={15} className="text-glacier-blue" />
            ) : (
              <AlertCircle size={15} className="text-cool-berry" />
            )}
          </div>
          <div className="mt-1">
            {porcentajeRestante === 0 ? (
              <span className="text-xl font-bold text-glacier-blue">¡Materia Aprobada! 🎉</span>
            ) : notaNecesaria > 5.0 ? (
              <span className="text-lg font-bold text-cool-berry">Fuera de alcance</span>
            ) : notaNecesaria <= 0 ? (
              <span className="text-xl font-bold text-glacier-blue">Aprobado asegurado</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-cool-berry tabular-nums">
                  {notaNecesaria.toFixed(2)}
                </span>
                <span className="text-xs text-arctic-secondary">promedio</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-arctic-tertiary mt-2">
            {porcentajeRestante > 0 ? `En el ${porcentajeRestante}% restante del curso` : "100% completado"}
          </div>
        </div>
      </div>

      {/* Formulario para agregar evaluación */}
      <form onSubmit={handleAdd} className="apple-card p-5">
        <h4 className="text-xs font-semibold text-arctic-tertiary uppercase tracking-wider mb-3">
          Agregar nueva nota o parcial
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="w-full sm:col-span-1">
            <label className="block text-[11px] font-medium text-arctic-secondary mb-1">
              Nombre de la evaluación
            </label>
            <input 
              required 
              type="text" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              placeholder="Ej. Parcial 1, Taller 2..." 
              className="w-full bg-frost-base border border-black/[0.08] rounded-xl px-3.5 py-2 text-xs text-arctic-slate placeholder:text-arctic-tertiary outline-none focus:border-glacier-blue transition-all" 
            />
          </div>

          <div className="w-full">
            <label className="block text-[11px] font-medium text-arctic-secondary mb-1">
              Peso (%)
            </label>
            <input 
              required 
              type="number" 
              step="0.1" 
              min="0.1" 
              max="100" 
              value={porcentaje} 
              onChange={e => setPorcentaje(e.target.value)} 
              placeholder="25" 
              className="w-full bg-frost-base border border-black/[0.08] rounded-xl px-3.5 py-2 text-xs text-arctic-slate outline-none focus:border-glacier-blue font-mono tabular-nums" 
            />
          </div>

          <div className="w-full">
            <label className="block text-[11px] font-medium text-arctic-secondary mb-1">
              Nota (0-5)
            </label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              max="5" 
              value={nota} 
              onChange={e => setNota(e.target.value)} 
              placeholder="Opcional" 
              className="w-full bg-frost-base border border-black/[0.08] rounded-xl px-3.5 py-2 text-xs text-arctic-slate outline-none focus:border-glacier-blue font-mono tabular-nums" 
            />
          </div>

          <button 
            type="submit" 
            disabled={porcentajeTotal >= 100} 
            className="btn-apple-primary text-xs py-2 px-5 disabled:opacity-40 apple-tactile shrink-0 w-full sm:w-auto shadow-apple-sm"
          >
            <Plus size={13} />
            <span>Agregar</span>
          </button>
        </div>

        {error && (
          <p className="text-cool-berry text-xs mt-3 bg-cool-berry/10 p-2.5 rounded-xl border border-cool-berry/20 font-medium">
            {error}
          </p>
        )}
      </form>

      {/* Lista de Evaluaciones */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-arctic-tertiary uppercase tracking-wider px-1">
          Desglose ({evaluaciones.length})
        </h4>

        {evaluaciones.length === 0 ? (
          <div className="apple-card p-6 text-center text-xs text-arctic-secondary">
            No has registrado evaluaciones para esta materia aún.
          </div>
        ) : (
          evaluaciones.map(ev => (
            <div 
              key={ev.id} 
              className="apple-card p-3 sm:p-3.5 px-3.5 sm:px-4 flex justify-between items-center gap-2.5 group transition-all"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="font-semibold text-xs text-arctic-slate truncate">{ev.nombre}</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-arctic-secondary bg-black/[0.04] px-2 py-0.5 rounded-full shrink-0">
                  {ev.porcentaje}%
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                <span className="font-bold text-xs sm:text-sm text-arctic-slate font-mono tabular-nums">
                  {ev.nota_obtenida !== null ? Number(ev.nota_obtenida).toFixed(1) : "Pendiente"}
                </span>
                <button 
                  onClick={() => handleDelete(ev.id)} 
                  className="text-arctic-tertiary hover:text-cool-berry transition-colors p-1.5 rounded-lg hover:bg-cool-berry/10 apple-tactile"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
