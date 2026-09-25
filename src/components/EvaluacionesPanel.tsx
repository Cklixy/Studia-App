"use client";

import { useState, useEffect, useCallback, useId, useRef } from "react";
import { Trash2, Plus, Award, AlertCircle, CheckCircle2, Undo2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { fundido, resorte } from "@/lib/movimiento";

type Evaluacion = {
  id: string;
  nombre: string;
  porcentaje: number;
  nota_obtenida: number | null;
};

const NOTA_APROBATORIA = 3.0;
const DESHACER_MS = 6000;

const fmt = (n: number, d = 2) => n.toFixed(d).replace(".", ",");

export default function EvaluacionesPanel({ materiaId }: { materiaId: string }) {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reducido = useReducedMotion();

  const [nombre, setNombre] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [nota, setNota] = useState("");
  const [simulada, setSimulada] = useState(3.5);
  const idCampo = useId();

  // Eliminación con «Deshacer»: se quita de la lista al instante y se borra en el servidor al
  // vencer el aviso (antes, confirm() del navegador y sin vuelta atrás).
  const [eliminada, setEliminada] = useState<Evaluacion | null>(null);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendienteRef = useRef<Evaluacion | null>(null);

  const fetchEvaluaciones = useCallback(async () => {
    const res = await fetch(`/api/materias/${materiaId}/evaluaciones`);
    if (res.ok) {
      const data: Evaluacion[] = await res.json();
      // Si hay un borrado en espera, no debe reaparecer
      setEvaluaciones(data.filter((e) => e.id !== pendienteRef.current?.id));
    }
    setLoading(false);
  }, [materiaId]);

  useEffect(() => {
    setLoading(true);
    fetchEvaluaciones();
  }, [fetchEvaluaciones]);

  const borrarEnServidor = useCallback(async (ev: Evaluacion) => {
    pendienteRef.current = null;
    await fetch(`/api/evaluaciones/${ev.id}`, { method: "DELETE" }).catch(() => {});
  }, []);

  // Al salir de la pantalla con un borrado en espera, se ejecuta
  useEffect(() => {
    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
      if (pendienteRef.current) void borrarEnServidor(pendienteRef.current);
    };
  }, [borrarEnServidor]);

  const handleDelete = (ev: Evaluacion) => {
    // Un borrado anterior en espera se confirma antes de empezar otro
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    if (pendienteRef.current) void borrarEnServidor(pendienteRef.current);

    pendienteRef.current = ev;
    setEliminada(ev);
    setEvaluaciones((lista) => lista.filter((e) => e.id !== ev.id));
    temporizadorRef.current = setTimeout(() => {
      void borrarEnServidor(ev);
      setEliminada(null);
    }, DESHACER_MS);
  };

  const deshacer = () => {
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    const ev = pendienteRef.current;
    pendienteRef.current = null;
    setEliminada(null);
    if (ev) setEvaluaciones((lista) => [...lista, ev]);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const p = parseFloat(porcentaje);
    const n = nota ? parseFloat(nota) : null;

    const res = await fetch(`/api/materias/${materiaId}/evaluaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, porcentaje: p, nota_obtenida: n }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      setError(typeof errorData.error === "string" ? errorData.error : "No pudimos agregar la evaluación. Revisa los datos.");
      return;
    }

    setNombre("");
    setPorcentaje("");
    setNota("");
    fetchEvaluaciones();
  };

  // Solo cuentan como evaluadas las que ya tienen nota. Antes un parcial «Pendiente» sumaba su peso
  // como si fuera un 0 y la tarjeta pedía, p. ej., 4,29 en vez de 3,0 (auditoría U-06).
  const tieneNota = (ev: Evaluacion) => ev.nota_obtenida !== null && ev.nota_obtenida !== undefined;
  const porcentajeRegistrado = evaluaciones.reduce((sum, ev) => sum + Number(ev.porcentaje), 0); // límite de 100 %
  const calificadas = evaluaciones.filter(tieneNota);
  const porcentajeTotal = calificadas.reduce((sum, ev) => sum + Number(ev.porcentaje), 0); // evaluado de verdad
  const porcentajePendiente = porcentajeRegistrado - porcentajeTotal;
  const porcentajeSinRegistrar = Math.max(0, 100 - porcentajeRegistrado);

  const acumuladaAportada = calificadas.reduce(
    (sum, ev) => sum + Number(ev.nota_obtenida) * (Number(ev.porcentaje) / 100),
    0
  );

  const notaActualSobreEvaluado = porcentajeTotal > 0 ? acumuladaAportada / (porcentajeTotal / 100) : 0;

  const porcentajeRestante = 100 - porcentajeTotal;
  const notaFaltanteParaAprobar = NOTA_APROBATORIA - acumuladaAportada;

  let notaNecesaria = 0;
  if (porcentajeRestante > 0) {
    notaNecesaria = notaFaltanteParaAprobar / (porcentajeRestante / 100);
  }
  // Con el 100 % calificado la nota final es la acumulada, y puede no llegar a 3,0
  const notaFinalAprobada = acumuladaAportada >= NOTA_APROBATORIA;

  // Simulador: si en todo lo que falta sacas `simulada`, ¿cuál sería la nota final?
  const notaProyectada = acumuladaAportada + simulada * (porcentajeRestante / 100);

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <span className="sr-only">Cargando evaluaciones…</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-hidden="true">
          <div className="h-28 rounded-2xl apple-shimmer" />
          <div className="h-28 rounded-2xl apple-shimmer" />
          <div className="h-28 rounded-2xl apple-shimmer" />
        </div>
      </div>
    );
  }

  const claseInput =
    "w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate tabular-nums";

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
        {/* Nota acumulada */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Nota acumulada</span>
            <Award size={15} className="text-sky-700" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-arctic-slate tabular-nums">
              {porcentajeTotal > 0 ? fmt(notaActualSobreEvaluado) : "—"}
            </span>
            <span className="text-xs text-arctic-secondary">/ 5,0</span>
          </div>
          <div className="text-xs text-arctic-secondary mt-2">
            {porcentajeTotal > 0 ? `Promedio sobre el ${porcentajeTotal}% calificado` : "Aún no tienes notas registradas"}
          </div>
        </div>

        {/* Requerimiento para aprobar */}
        <div className="apple-card p-5 flex flex-col justify-between sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-arctic-secondary font-medium">Para aprobar (3,0)</span>
            {(porcentajeRestante === 0 ? notaFinalAprobada : notaNecesaria <= 0) ? (
              <CheckCircle2 size={15} className="text-emerald-700" aria-hidden="true" />
            ) : (
              <AlertCircle size={15} className="text-cool-berry" aria-hidden="true" />
            )}
          </div>
          <div className="mt-1">
            {porcentajeRestante === 0 ? (
              notaFinalAprobada ? (
                <span className="text-xl font-bold text-emerald-700">¡Materia aprobada!</span>
              ) : (
                <span className="text-lg font-bold text-cool-berry">Nota final {fmt(acumuladaAportada)}: no alcanza 3,0</span>
              )
            ) : notaNecesaria > 5.0 ? (
              <span className="text-lg font-bold text-cool-berry">Necesitas más de 5,0: habla con tu docente</span>
            ) : notaNecesaria <= 0 ? (
              <span className="text-xl font-bold text-emerald-700">Aprobado asegurado</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-arctic-slate tabular-nums">{fmt(notaNecesaria)}</span>
                <span className="text-sm text-arctic-secondary">de promedio en el {porcentajeRestante}% que falta</span>
              </div>
            )}
          </div>

          {/* Barra de ponderaciones */}
          <div className="mt-4">
            <div
              className="flex h-2.5 w-full rounded-full overflow-hidden bg-black/[0.06]"
              role="img"
              aria-label={`${porcentajeTotal}% calificado, ${porcentajePendiente}% registrado sin nota y ${porcentajeSinRegistrar}% sin registrar`}
            >
              <div className="h-full bg-glacier-blue" style={{ width: `${Math.min(100, porcentajeTotal)}%` }} />
              <div
                className="h-full bg-glacier-blue/35"
                style={{ width: `${Math.min(100 - porcentajeTotal, porcentajePendiente)}%` }}
              />
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-arctic-secondary" aria-hidden="true">
              <li className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-glacier-blue" /> Calificado {porcentajeTotal}%
              </li>
              {porcentajePendiente > 0 && (
                <li className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-glacier-blue/35" /> Sin nota {porcentajePendiente}%
                </li>
              )}
              {porcentajeSinRegistrar > 0 && (
                <li className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" /> Sin registrar {porcentajeSinRegistrar}%
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Simulador */}
      {porcentajeRestante > 0 && (
        <div className="apple-card p-5">
          <label htmlFor={`${idCampo}-simulada`} className="block text-sm font-semibold text-arctic-slate">
            ¿Y si saco…?
          </label>
          <p className="text-xs text-arctic-secondary mt-0.5">Mueve la nota que esperas sacar en el {porcentajeRestante}% que falta.</p>
          <div className="flex items-center gap-4 mt-3">
            <input
              id={`${idCampo}-simulada`}
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={simulada}
              onChange={(e) => setSimulada(Number(e.target.value))}
              aria-valuetext={`${fmt(simulada, 1)}: nota final ${fmt(notaProyectada)}`}
              className="flex-1 accent-glacier-blue h-11"
            />
            <span className="text-2xl font-bold text-arctic-slate tabular-nums w-12 text-right">{fmt(simulada, 1)}</span>
          </div>
          <p className="text-sm text-arctic-slate mt-1" aria-live="polite">
            Nota final: <strong className="tabular-nums">{fmt(notaProyectada)}</strong> ·{" "}
            <span className={notaProyectada >= NOTA_APROBATORIA ? "text-emerald-700 font-semibold" : "text-cool-berry font-semibold"}>
              {notaProyectada >= NOTA_APROBATORIA ? "apruebas" : "no alcanza"}
            </span>
          </p>
        </div>
      )}

      {/* Formulario para agregar evaluación */}
      <form onSubmit={handleAdd} className="apple-card p-5">
        <h3 className="apple-headline text-arctic-slate mb-3">Agregar nota o parcial</h3>

        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
          <div>
            <label htmlFor={`${idCampo}-nombre`} className="block text-xs font-medium text-arctic-secondary mb-1.5">
              Nombre
            </label>
            <input
              id={`${idCampo}-nombre`}
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Parcial 1, Taller 2…"
              className={claseInput}
            />
          </div>

          <div>
            <label htmlFor={`${idCampo}-peso`} className="block text-xs font-medium text-arctic-secondary mb-1.5">
              Peso (%)
            </label>
            <input
              id={`${idCampo}-peso`}
              required
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0.1"
              max={Math.max(0.1, 100 - porcentajeRegistrado)}
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              placeholder="25"
              className={claseInput}
            />
          </div>

          <div>
            <label htmlFor={`${idCampo}-nota`} className="block text-xs font-medium text-arctic-secondary mb-1.5">
              Nota (opcional)
            </label>
            <input
              id={`${idCampo}-nota`}
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max="5"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="0 a 5"
              aria-describedby={`${idCampo}-nota-ayuda`}
              className={claseInput}
            />
          </div>

          <button
            type="submit"
            disabled={porcentajeRegistrado >= 100}
            className="btn-apple-primary text-sm min-h-11 px-5 disabled:opacity-40 apple-tactile w-full sm:w-auto"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Agregar</span>
          </button>
        </div>
        <p id={`${idCampo}-nota-ayuda`} className="text-xs text-arctic-secondary mt-2">
          {porcentajeRegistrado >= 100
            ? "Ya registraste el 100% de la materia."
            : "Deja la nota vacía si aún no la tienes; podrás calcular cuánto necesitas."}
        </p>

        {error && (
          <p role="alert" className="text-cool-berry text-sm mt-3 bg-cool-berry/10 p-3 rounded-xl border border-cool-berry/20">
            {error}
          </p>
        )}
      </form>

      {/* Lista de evaluaciones */}
      <section className="space-y-2" aria-labelledby={`${idCampo}-desglose`}>
        <h3 id={`${idCampo}-desglose`} className="apple-headline text-arctic-slate px-1">
          Desglose ({evaluaciones.length})
        </h3>

        {evaluaciones.length === 0 ? (
          <div className="apple-card p-6 text-center text-sm text-arctic-secondary">
            No has registrado evaluaciones para esta materia aún.
          </div>
        ) : (
          <ul className="apple-card p-0 divide-y divide-black/[0.06] overflow-hidden">
            <AnimatePresence initial={false}>
              {evaluaciones.map((ev) => (
                <motion.li
                  key={ev.id}
                  layout={!reducido}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reducido ? fundido : resorte}
                  className="flex justify-between items-center gap-3 px-4 py-2 min-h-14"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-semibold text-sm text-arctic-slate truncate">{ev.nombre}</span>
                    <span className="text-xs font-medium text-arctic-secondary bg-black/[0.04] px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                      {ev.porcentaje}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm tabular-nums ${tieneNota(ev) ? "font-bold text-arctic-slate" : "text-arctic-secondary"}`}>
                      {tieneNota(ev) ? fmt(Number(ev.nota_obtenida), 1) : "Pendiente"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(ev)}
                      aria-label={`Eliminar ${ev.nombre}`}
                      className="text-arctic-secondary hover:text-cool-berry transition-colors w-11 h-11 flex items-center justify-center rounded-full hover:bg-cool-berry/10 apple-tactile"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* Aviso con «Deshacer» */}
      <div className="fixed inset-x-0 bottom-28 sm:bottom-32 z-50 flex justify-center px-4 pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {eliminada && (
            <motion.div
              key={eliminada.id}
              initial={reducido ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducido ? { opacity: 0 } : { opacity: 0, y: 16 }}
              transition={reducido ? fundido : resorte}
              className="pointer-events-auto flex items-center gap-3 pl-5 pr-2 py-2 rounded-full apple-glass shadow-apple-lg text-arctic-slate max-w-full"
            >
              <span className="text-sm truncate">«{eliminada.nombre}» eliminada</span>
              <button
                type="button"
                onClick={deshacer}
                className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full text-sm font-semibold text-glacier-blue hover:bg-glacier-blue/10 transition-colors shrink-0"
              >
                <Undo2 size={15} aria-hidden="true" />
                Deshacer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
