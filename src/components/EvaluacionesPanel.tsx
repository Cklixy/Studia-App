"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { Trash2, Plus } from "lucide-react";
import { avisar } from "@/lib/avisos";
import BarraProgreso from "@/components/ui/BarraProgreso";

type Evaluacion = {
  id: string;
  nombre: string;
  porcentaje: number;
  nota_obtenida: number | null;
};

// Notas de una materia (rediseño 4.5): cuánto llevas, cuánto necesitas y el desglose. El cálculo no cambia;
// los colores sí: «necesitas 2,8» es una nota normal (tinta), no una alarma (antes en rojo).
export default function EvaluacionesPanel({ materiaId, conTitulo = true }: { materiaId: string; conTitulo?: boolean }) {
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
    avisar("Nota guardada");
    fetchEvaluaciones();
  };

  const handleDelete = async (id: string) => {
    const ev = evaluaciones.find((e) => e.id === id);
    if (!confirm(`¿Eliminar «${ev?.nombre ?? "esta evaluación"}»? Esta acción no se puede deshacer.`)) return;
    const r = await fetch(`/api/evaluaciones/${id}`, { method: "DELETE" });
    avisar(r.ok ? "Evaluación eliminada" : "No se pudo eliminar", r.ok ? "exito" : "error");
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

  // En Parciales el título «Notas» lo pone la sección que lo envuelve (evita dos regiones con el mismo nombre)
  const Contenedor = conTitulo ? "section" : "div";
  // Estado de «para aprobar»: tono y texto
  const aprobar =
    porcentajeRestante === 0
      ? notaFinalAprobada
        ? { tono: "exito", valor: "Aprobada", nota: "Con el 100 % calificado." }
        : { tono: "error", valor: acumuladaAportada.toFixed(2), nota: "Nota final: no alcanza 3,0." }
      : notaNecesaria <= 0
        ? { tono: "exito", valor: "Asegurado", nota: "Ya tienes el 3,0 aunque saques 0 en lo que falta." }
        : notaNecesaria > 5
          ? { tono: "error", valor: "> 5,0", nota: "No alcanza con lo que falta: habla con tu docente." }
          : { tono: notaNecesaria > 4 ? "aviso" : "tinta", valor: notaNecesaria.toFixed(2).replace(".", ","), nota: `Promedio que necesitas en el ${porcentajeRestante} % que falta.` };
  const colorTono: Record<string, string> = { exito: "text-exito", error: "text-error", aviso: "text-aviso", tinta: "text-tinta" };

  return (
    <Contenedor {...(conTitulo ? { "aria-labelledby": `${idCampo}-titulo` } : {})} aria-busy={loading} className="flex flex-col gap-4">
      {conTitulo && <h2 id={`${idCampo}-titulo`} className="titulo-2">Notas</h2>}

      {loading ? (
        <div className="grid grid-cols-2 gap-2"><div className="esqueleto h-28" /><div className="esqueleto h-28" /><span className="sr-only">Cargando notas…</span></div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-2">
            <div className="tarjeta p-4 flex flex-col">
              <dt className="text-sm font-semibold text-tinta-2">Llevas</dt>
              <dd className="font-display text-4xl leading-none text-tinta tabular-nums mt-2">
                {porcentajeTotal > 0 ? notaActualSobreEvaluado.toFixed(2).replace(".", ",") : "—"}
              </dd>
            </div>
            <div className="tarjeta p-4 flex flex-col">
              <dt className="text-sm font-semibold text-tinta-2">Para aprobar (3,0)</dt>
              <dd className={`font-display text-4xl leading-none tabular-nums mt-2 ${colorTono[aprobar.tono]}`}>{aprobar.valor}</dd>
            </div>
          </dl>
          <p className="-mt-1 text-sm text-tinta-2">{aprobar.nota}</p>

          <div className="flex items-center gap-3">
            <BarraProgreso valor={porcentajeTotal} etiqueta="Porcentaje calificado" textoValor={`${porcentajeTotal} % calificado`} className="flex-1" />
            <span className="text-sm text-tinta-2 tabular-nums shrink-0">{porcentajeTotal} % calificado</span>
          </div>
          {porcentajePendiente > 0 && <p className="-mt-2 text-xs text-tinta-2">{porcentajePendiente} % registrado sin nota todavía.</p>}

          {evaluaciones.length > 0 && (
            <ul className="flex flex-col gap-2" aria-label="Evaluaciones registradas">
              {evaluaciones.map((ev) => (
                <li key={ev.id} className="tarjeta flex items-center gap-3 py-2 pl-4 pr-1.5">
                  <span className="min-w-0 flex-1 font-semibold text-tinta truncate">{ev.nombre}</span>
                  <span className="chip shrink-0">{ev.porcentaje} %</span>
                  {ev.nota_obtenida !== null ? (
                    <span className="w-12 text-right font-bold text-tinta tabular-nums">{Number(ev.nota_obtenida).toFixed(1).replace(".", ",")}</span>
                  ) : (
                    <span className="chip chip-aviso shrink-0">Pendiente</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(ev.id)}
                    aria-label={`Eliminar ${ev.nombre}`}
                    className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-tinta-2 hover:text-error hover:bg-error-suave"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAdd} className="tarjeta p-4 sm:p-5 flex flex-col gap-3">
            <p className="encabezado">{evaluaciones.length ? "Agregar otra evaluación" : "Registra tu primera evaluación"}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label htmlFor={`${idCampo}-nombre`} className="text-sm font-semibold">Nombre</label>
                <input id={`${idCampo}-nombre`} required type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Parcial 1" maxLength={100} className="campo" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idCampo}-peso`} className="text-sm font-semibold">Peso (%)</label>
                <input id={`${idCampo}-peso`} required type="number" inputMode="decimal" step="0.1" min="0.1" max="100" value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} placeholder="30" className="campo tabular-nums" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idCampo}-nota`} className="text-sm font-semibold">
                  Nota <span className="font-normal text-tinta-2">(opcional)</span>
                </label>
                <input id={`${idCampo}-nota`} type="number" inputMode="decimal" step="0.1" min="0" max="5" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="0 a 5" aria-describedby={`${idCampo}-ayuda`} className="campo tabular-nums" />
              </div>
            </div>
            <p id={`${idCampo}-ayuda`} className="text-xs text-tinta-2">Si aún no tienes la nota, déjala vacía: no cuenta como 0.</p>
            {error && <p role="alert" className="text-sm font-semibold text-error">{error}</p>}
            <button type="submit" disabled={porcentajeRegistrado >= 100} className="btn-secundario sm:self-start">
              <Plus aria-hidden="true" size={18} />
              {porcentajeRegistrado >= 100 ? "Ya registraste el 100 %" : "Agregar evaluación"}
            </button>
          </form>
        </>
      )}
    </Contenedor>
  );
}
