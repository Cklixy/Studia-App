"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ChevronLeft, Loader2, Target, BookOpenText, RotateCcw, PencilLine, HelpCircle, Timer,
  Brain, TrendingUp, FlaskConical, FileText, Sparkles, Check,
} from "lucide-react";
import { StudyContext, getRecommendation, Recommendation } from "@/lib/recommendationEngine";

// Preparar una sesión (rediseño 4.3). Antes: 5 pasos y el nivel educativo en cada sesión.
// Ahora: 1) qué estudiar (se salta si viene elegido desde Hoy o una materia), 2) qué necesitas hoy,
// 3) método sugerido + duración → Empezar. El nivel se recuerda en este dispositivo.
// Las llamadas a la API y los datos enviados son los mismos que antes.

type Opcion = { valor: StudyContext; etiqueta: string; icono: typeof Target };
const PRINCIPALES: Opcion[] = [
  { valor: "🎯 Preparación para parcial, quiz o evaluación", etiqueta: "Prepararme para un parcial", icono: Target },
  { valor: "📚 Necesito aprender un tema desde cero", etiqueta: "Aprenderlo desde cero", icono: BookOpenText },
  { valor: "🔄 Necesito repasar", etiqueta: "Repasar", icono: RotateCcw },
  { valor: "✏️ Necesito practicar ejercicios", etiqueta: "Practicar ejercicios", icono: PencilLine },
  { valor: "🧩 No entiendo el tema", etiqueta: "No lo entiendo", icono: HelpCircle },
  { valor: "⏱️ Tengo poco tiempo", etiqueta: "Tengo poco tiempo", icono: Timer },
];
const OTRAS: Opcion[] = [
  { valor: "🧠 Necesito memorizar información", etiqueta: "Memorizar información", icono: Brain },
  { valor: "📈 Quiero mejorar mi rendimiento", etiqueta: "Mejorar mi rendimiento", icono: TrendingUp },
  { valor: "🔬 Necesito preparar un laboratorio o proyecto", etiqueta: "Preparar un laboratorio o proyecto", icono: FlaskConical },
  { valor: "📄 Necesito realizar una lectura o trabajo escrito", etiqueta: "Hacer una lectura o un trabajo escrito", icono: FileText },
];
const NIVELES = ["Universidad", "Colegio", "Otra / Personalizada"];
const DURACIONES = [15, 25, 45, 60];
const CLAVE_NIVEL = "studia-nivel";

type Fase = "que" | "como" | "listo";

export default function SessionWizard({
  initialMaterias,
  preMateriaId = "",
  preMateriaNombre = "",
  preTemaId = "",
  preTemaNombre = "",
}: {
  initialMaterias: { id: string; nombre: string }[];
  /** Compatibilidad: ya no se usa (el paso de nivel desapareció) */
  initialStep?: number;
  preNivel?: string;
  preMateriaId?: string;
  preMateriaNombre?: string;
  preTemaId?: string;
  preTemaNombre?: string;
}) {
  const router = useRouter();
  const id = useId();
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const conTemaInicial = Boolean(preTemaId || preTemaNombre);
  const [fase, setFase] = useState<Fase>(conTemaInicial ? "como" : "que");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nivel, setNivel] = useState("Universidad");
  const [materiaId, setMateriaId] = useState(preMateriaId);
  const [materiaNombre, setMateriaNombre] = useState(preMateriaNombre);
  const [temaId, setTemaId] = useState(preTemaId);
  const [temaNombre, setTemaNombre] = useState(preTemaNombre);
  const [temaLibre, setTemaLibre] = useState("");
  const [materiaLibre, setMateriaLibre] = useState("");
  const [temas, setTemas] = useState<{ id: string; nombre: string; estado?: string }[]>([]);

  const [contexto, setContexto] = useState<StudyContext | "">("");
  const [recomendacion, setRecomendacion] = useState<Recommendation | null>(null);
  const [origen, setOrigen] = useState<"ia" | "reglas">("reglas");
  const [duracion, setDuracion] = useState(25);
  const [objetivo, setObjetivo] = useState("");

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_NIVEL);
      if (guardado && NIVELES.includes(guardado)) setNivel(guardado);
    } catch {}
  }, []);

  useEffect(() => {
    if (!materiaId || conTemaInicial) return;
    fetch(`/api/materias/${materiaId}/temas`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setTemas(d); })
      .catch(() => setTemas([]));
  }, [materiaId, conTemaInicial]);

  // Al cambiar de fase, el foco va al nuevo título (lectores de pantalla y teclado)
  useEffect(() => { tituloRef.current?.focus(); }, [fase]);

  const cambiarNivel = (n: string) => {
    setNivel(n);
    try { localStorage.setItem(CLAVE_NIVEL, n); } catch {}
  };

  const elegirTema = (idTema: string, nombre: string) => {
    setTemaId(idTema);
    setTemaNombre(nombre);
    setFase("como");
  };

  // El valor elegido se pasa como argumento (auditoría U-04: el estado aún no se había aplicado)
  const elegirContexto = async (c: StudyContext) => {
    setContexto(c);
    setCargando(true);
    const materia = materiaNombre || materiaLibre;
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("/api/sesiones/recomendacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel_educativo: nivel, materia_nombre: materia, tema_nombre: temaNombre, contexto: c }),
        signal: controller.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error("sin IA");
      setRecomendacion(await res.json());
      setOrigen("ia");
    } catch {
      setRecomendacion(getRecommendation(nivel, materia || "", c));
      setOrigen("reglas");
    } finally {
      setCargando(false);
      setFase("listo");
    }
  };

  const empezar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nivel_educativo: nivel,
          materia_id: materiaId || null,
          materia_nombre: !materiaId ? materiaNombre || materiaLibre : undefined,
          tema_id: temaId || null,
          tema_nombre: !temaId ? temaNombre : undefined,
          contexto,
          metodo_recomendado: recomendacion?.metodo,
          metodo_utilizado: recomendacion?.metodo,
          objetivo,
          duracion_planificada_minutos: duracion,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.error === "string" ? d.error : "No pudimos iniciar la sesión. Inténtalo de nuevo.");
      }
      const sesion = await res.json();
      router.push(`/sesion/activa/${sesion.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar la sesión.");
      setCargando(false);
    }
  };

  const pasos: Fase[] = conTemaInicial ? ["como", "listo"] : ["que", "como", "listo"];
  const numero = pasos.indexOf(fase) + 1;
  const volver = () => setFase(pasos[Math.max(0, numero - 2)]);

  const opcion = (o: Opcion) => {
    const Icono = o.icono;
    const elegida = contexto === o.valor;
    return (
      <button
        key={o.valor}
        type="button"
        role="radio"
        aria-checked={elegida}
        onClick={() => elegirContexto(o.valor)}
        className={`tactil flex items-center gap-3 min-h-14 rounded-2xl border px-4 py-3 text-left font-semibold ${
          elegida ? "border-acento bg-acento-suave text-acento" : "border-linea bg-superficie text-tinta hover:border-linea-fuerte"
        }`}
      >
        <Icono aria-hidden="true" size={20} className="shrink-0 text-acento" />
        {o.etiqueta}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 min-h-11">
        {numero > 1 ? (
          <button type="button" onClick={volver} className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-tinta-2 hover:text-tinta">
            <ChevronLeft aria-hidden="true" size={18} /> Atrás
          </button>
        ) : <span />}
        <p className="text-sm font-semibold text-tinta-2">Paso {numero} de {pasos.length}</p>
      </div>

      {/* Resumen de lo elegido: siempre visible a partir del segundo paso */}
      {fase !== "que" && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-hundido px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-tinta-2">{materiaNombre || materiaLibre || "Tema libre"}</p>
            <p className="font-semibold text-tinta truncate">{temaNombre}</p>
          </div>
          {!conTemaInicial && (
            <button type="button" onClick={() => setFase("que")} className="shrink-0 inline-flex min-h-11 items-center px-2 text-sm font-semibold text-acento">
              Cambiar
            </button>
          )}
        </div>
      )}

      {error && <p role="alert" className="rounded-xl bg-error-suave px-4 py-3 text-sm font-semibold text-error">{error}</p>}

      {fase === "que" && (
        <section aria-labelledby={`${id}-t`} className="flex flex-col gap-5">
          <h2 id={`${id}-t`} ref={tituloRef} tabIndex={-1} className="titulo-2 focus:outline-none">¿Qué vas a estudiar?</h2>

          {initialMaterias.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-tinta-2" id={`${id}-mat`}>Materia</p>
              <div role="radiogroup" aria-labelledby={`${id}-mat`} className="flex flex-wrap gap-2">
                {initialMaterias.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={materiaId === m.id}
                    onClick={() => { setMateriaId(m.id); setMateriaNombre(m.nombre); setTemas([]); }}
                    className={`tactil min-h-11 rounded-full border px-4 text-sm font-semibold ${
                      materiaId === m.id ? "border-acento bg-acento-suave text-acento" : "border-linea-fuerte bg-superficie text-tinta"
                    }`}
                  >
                    {m.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {materiaId && temas.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-tinta-2">Tema</p>
              <ul className="flex flex-col gap-2">
                {temas.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => elegirTema(t.id, t.nombre)}
                      className="tactil tarjeta w-full flex items-center justify-between gap-3 min-h-14 px-4 py-3 text-left font-semibold"
                    >
                      <span className={t.estado === "completado" ? "text-tinta-2" : "text-tinta"}>{t.nombre}</span>
                      {t.estado === "completado" ? <span className="chip chip-exito"><Check aria-hidden="true" size={14} />Hecho</span> : <ArrowRight aria-hidden="true" size={18} className="text-tinta-3" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!temaLibre.trim() || (!materiaId && !materiaLibre.trim())) return;
              elegirTema("", temaLibre.trim());
            }}
            className="flex flex-col gap-3 rounded-2xl border border-dashed border-linea-fuerte p-4"
          >
            <p className="text-sm font-semibold text-tinta">{materiaId ? "¿Otro tema?" : "Escríbelo"}</p>
            {!materiaId && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-ml`} className="text-sm font-semibold">Materia</label>
                <input id={`${id}-ml`} className="campo" value={materiaLibre} onChange={(e) => setMateriaLibre(e.target.value)} placeholder="Ej. Cálculo I" maxLength={100} />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-tl`} className="text-sm font-semibold">Tema</label>
              <input id={`${id}-tl`} className="campo" value={temaLibre} onChange={(e) => setTemaLibre(e.target.value)} placeholder="Ej. Regla de la cadena" maxLength={150} />
            </div>
            <button type="submit" disabled={!temaLibre.trim() || (!materiaId && !materiaLibre.trim())} className="btn-secundario sm:self-start">
              Continuar <ArrowRight aria-hidden="true" size={18} />
            </button>
          </form>
        </section>
      )}

      {fase === "como" && (
        <section aria-labelledby={`${id}-c`} aria-busy={cargando} className="flex flex-col gap-4">
          <h2 id={`${id}-c`} ref={tituloRef} tabIndex={-1} className="titulo-2 focus:outline-none">¿Qué necesitas hoy?</h2>
          <p className="subtitulo -mt-2">Con esto te sugerimos cómo estudiarlo.</p>
          {cargando ? (
            <div role="status" className="flex items-center gap-3 rounded-2xl bg-hundido px-4 py-6 font-semibold text-tinta">
              <Loader2 aria-hidden="true" size={20} className="animate-spin text-acento" />
              Buscando el mejor método para ti…
            </div>
          ) : (
            <>
              <div role="radiogroup" aria-labelledby={`${id}-c`} className="grid gap-2 sm:grid-cols-2">
                {PRINCIPALES.map(opcion)}
              </div>
              <details>
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-acento">Otras situaciones</summary>
                <div role="radiogroup" aria-label="Otras situaciones" className="mt-2 grid gap-2 sm:grid-cols-2">
                  {OTRAS.map(opcion)}
                </div>
              </details>
              <details className="text-sm">
                <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-tinta-2">Más opciones · nivel: {nivel === "Otra / Personalizada" ? "otro" : nivel.toLowerCase()}</summary>
                <div className="flex flex-col gap-1.5 pb-1">
                  <label htmlFor={`${id}-n`} className="font-semibold">Nivel de estudios</label>
                  <select id={`${id}-n`} className="campo sm:max-w-xs" value={nivel} onChange={(e) => cambiarNivel(e.target.value)}>
                    {NIVELES.map((n) => <option key={n} value={n}>{n === "Otra / Personalizada" ? "Otro (autodidacta, certificación…)" : n}</option>)}
                  </select>
                  <p className="text-xs text-tinta-2">Se recuerda en este dispositivo.</p>
                </div>
              </details>
            </>
          )}
        </section>
      )}

      {fase === "listo" && recomendacion && (
        <section aria-labelledby={`${id}-l`} className="flex flex-col gap-5">
          <h2 id={`${id}-l`} ref={tituloRef} tabIndex={-1} className="titulo-2 focus:outline-none">Tu plan para esta sesión</h2>

          <div className="tarjeta p-5">
            <p className="chip chip-acento">
              <Sparkles aria-hidden="true" size={14} />
              {origen === "ia" ? "Sugerido por la IA" : "Sugerido por reglas de estudio"}
            </p>
            <h3 className="titulo-3 mt-3">{recomendacion.metodo}</h3>
            <p className="text-tinta-2 mt-1">{recomendacion.justificacion}</p>
            <ol className="mt-4 flex flex-col gap-2 border-t border-linea pt-4">
              {recomendacion.pasos.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="font-display text-lg leading-6 text-acento w-5 shrink-0">{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-semibold mb-2">¿Cuánto tiempo?</legend>
            <div className="segmentado w-full">
              {DURACIONES.map((d) => (
                <label key={d} className={`flex-1 flex min-h-11 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-acento ${duracion === d ? "bg-superficie text-tinta shadow-1 ring-1 ring-linea-fuerte" : "text-tinta-2"}`}>
                  <input type="radio" name={`${id}-dur`} value={d} checked={duracion === d} onChange={() => setDuracion(d)} className="sr-only" />
                  {d} min
                </label>
              ))}
            </div>
            <p className="text-xs text-tinta-2">Una sesión corta y constante rinde más que una larga de vez en cuando.</p>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-o`} className="text-sm font-semibold">
              Objetivo <span className="font-normal text-tinta-2">(opcional)</span>
            </label>
            <input id={`${id}-o`} className="campo" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Ej. Resolver 5 ejercicios del taller" maxLength={200} />
          </div>

          <button type="button" onClick={empezar} disabled={cargando} className="btn-primario text-base min-h-14">
            {cargando ? <Loader2 aria-hidden="true" size={20} className="animate-spin" /> : null}
            {cargando ? "Preparando…" : `Empezar sesión de ${duracion} min`}
            {!cargando && <ArrowRight aria-hidden="true" size={20} />}
          </button>
        </section>
      )}
    </div>
  );
}
