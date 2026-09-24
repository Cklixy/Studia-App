"use client";

import { useState, useEffect, useCallback, useId } from "react";
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
  const idCampo = useId();

  const fetchEvaluaciones = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/materias/${materiaId}/evaluaciones`);
    if (res.ok) {
      const data = await res.json();
      setEvaluaciones(data);
    }
    setLoading(false);
  }, [materiaId]);

  useEffect(() => {
    fetchEvaluaciones();
  }, [fetchEvaluaciones]);

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
    const ev = evaluaciones.find((e) => e.id === id);
    if (!confirm(`¿Eliminar «${ev?.nombre ?? "esta evaluación"}»? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/evaluaciones/${id}`, { method: "DELETE" });
    fetchEvaluaciones();
  };

  // Solo cuentan como evaluadas las que ya tienen nota. Antes un parcial «Pendiente» sumaba su peso
  // como si fuera un 0 y la tarjeta pedía, p. ej., 4,29 en vez de 3,0 (auditoría U-06).
  const tieneNota = (ev: Evaluacion) => ev.nota_obtenida !== null && ev.nota_obtenida !== undefined;
  const porcentajeRegistrado = evaluaciones.reduce((sum, ev) => sum + Number(ev.porcentaje), 0); // límite de 100 %
  const calificadas = evaluaciones.filter(tieneNota);
  const porcentajeTotal = calificadas.reduce((sum, ev) => sum + Number(ev.porcentaje), 0); // evaluado de verdad
  const porcentajePendiente = porcentajeRegistrado - porcentajeTotal;

  const acumuladaAportada = calificadas.reduce(
    (sum, ev) => sum + Number(ev.nota_obtenida) * (Number(ev.porcentaje) / 100),
    0
  );

  const notaActualSobreEvaluado = porcentajeTotal > 0 ? (acumuladaAportada / (porcentajeTotal / 100)) : 0;

  const porcentajeRestante = 100 - porcentajeTotal;
  const notaFaltanteParaAprobar = 3.0 - acumuladaAportada;

  let notaNecesaria = 0;
  if (porcentajeRestante > 0) {
    notaNecesaria = notaFaltanteParaAprobar / (porcentajeRestante / 100);
  }
  // Con el 100 % calificado la nota final es la acumulada, y puede no llegar a 3,0
  const notaFinalAprobada = acumuladaAportada >= 3.0;

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
    <div className="space-y-6 duration-300">

      {/* Tarjetas de métricas estilo Apple Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">

        {/* Porcentaje evaluado */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Porcentaje Evaluado</span>
            <span className="text-xs font-semibold text-glacier-blue">{porcentajeRestante}% por calificar</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-arctic-slate tabular-nums">{porcentajeTotal}%</span>
            <span className="text-xs text-arctic-secondary">/ 100%</span>
          </div>
          <div className="mt-3 w-full bg-black/[0.05] rounded-full h-1.5 overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-glacier-blue rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, porcentajeTotal)}%` }}
            />
          </div>
          {porcentajePendiente > 0 && (
            <p className="text-xs text-arctic-secondary mt-2">
              {porcentajePendiente}% registrado, pendiente de nota
            </p>
          )}
        </div>

        {/* Nota acumulada */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Nota Acumulada</span>
            <div className="w-6 h-6 rounded-lg bg-polar-cyan/10 text-sky-700 flex items-center justify-center" aria-hidden="true">
              <Award size={13} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-arctic-slate tabular-nums">
              {porcentajeTotal > 0 ? notaActualSobreEvaluado.toFixed(2) : "—"}
            </span>
            <span className="text-xs text-arctic-secondary">/ 5.0</span>
          </div>
          <div className="text-xs text-arctic-secondary mt-2">
            {porcentajeTotal > 0 ? `Promedio sobre el ${porcentajeTotal}% calificado` : "Aún no tienes notas registradas"}
          </div>
        </div>

        {/* Requerimiento para aprobar */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Para Aprobar (3.0)</span>
            {(porcentajeRestante === 0 ? notaFinalAprobada : notaNecesaria <= 0) ? (
              <CheckCircle2 size={15} className="text-glacier-blue" aria-hidden="true" />
            ) : (
              <AlertCircle size={15} className="text-cool-berry" aria-hidden="true" />
            )}
          </div>
          <div className="mt-1">
            {porcentajeRestante === 0 ? (
              notaFinalAprobada ? (
                <span className="text-xl font-bold text-glacier-blue">¡Materia aprobada! <span aria-hidden="true">🎉</span></span>
              ) : (
                <span className="text-lg font-bold text-cool-berry">Nota final {acumuladaAportada.toFixed(2)}: no alcanza 3,0</span>
              )
            ) : notaNecesaria > 5.0 ? (
              <span className="text-lg font-bold text-cool-berry">Necesitas más de 5,0: habla con tu docente</span>
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
          <div className="text-xs text-arctic-secondary mt-2">
            {porcentajeRestante > 0 ? `En el ${porcentajeRestante}% que falta por calificar` : "100% calificado"}
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
            <label htmlFor={`${idCampo}-nombre`} className="block text-xs font-medium text-arctic-secondary mb-1">
              Nombre de la evaluación
            </label>
            <input
              id={`${idCampo}-nombre`}
              required
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Parcial 1, Taller 2..."
              className="w-full bg-frost-base border border-black/[0.08] rounded-xl px-3.5 py-2 text-xs text-arctic-slate placeholder:text-arctic-tertiary outline-none focus:border-glacier-blue transition-all"
            />
          </div>

          <div className="w-full">
            <label htmlFor={`${idCampo}-peso`} className="block text-xs font-medium text-arctic-secondary mb-1">
              Peso (%)
            </label>
            <input
              id={`${idCampo}-peso`}
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
            <label htmlFor={`${idCampo}-nota`} className="block text-xs font-medium text-arctic-secondary mb-1">
              Nota (0-5) <span className="font-normal">· déjala vacía si aún no la tienes</span>
            </label>
            <input
              id={`${idCampo}-nota`}
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
            disabled={porcentajeRegistrado >= 100}
            className="btn-apple-primary text-xs py-2 px-5 disabled:opacity-40 apple-tactile shrink-0 w-full sm:w-auto shadow-apple-sm"
          >
            <Plus size={13} aria-hidden="true" />
            <span>Agregar</span>
          </button>
        </div>

        {error && (
          <p role="alert" className="text-cool-berry text-xs mt-3 bg-cool-berry/10 p-2.5 rounded-xl border border-cool-berry/20 font-medium">
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
                <span className="text-xs font-medium text-arctic-secondary bg-black/[0.04] px-2 py-0.5 rounded-full shrink-0">
                  {ev.porcentaje}%
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                <span className="font-bold text-xs sm:text-sm text-arctic-slate font-mono tabular-nums">
                  {ev.nota_obtenida !== null ? Number(ev.nota_obtenida).toFixed(1) : "Pendiente"}
                </span>
                <button
                  onClick={() => handleDelete(ev.id)}
                  aria-label={`Eliminar ${ev.nombre}`}
                  className="text-arctic-secondary hover:text-cool-berry transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cool-berry/10 apple-tactile"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
