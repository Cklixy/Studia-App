"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { StudyContext, getRecommendation, Recommendation } from "@/lib/recommendationEngine";
import { ArrowRight, RotateCw, Clock, MoreHorizontal, Sparkles, ChevronLeft, Target } from "lucide-react";
import SelectorAmbientes from "@/components/musica/SelectorAmbientes";
import { fundido, resorte } from "@/lib/movimiento";

// "📝 Tengo un examen próximamente" sigue existiendo en el motor, pero no se ofrece: duplicaba
// "🎯 Preparación para parcial, quiz o evaluación" (auditoría U-14).
const CONTEXTOS: StudyContext[] = [
  "🎯 Preparación para parcial, quiz o evaluación",
  "📚 Necesito aprender un tema desde cero",
  "🔄 Necesito repasar",
  "🧠 Necesito memorizar información",
  "✏️ Necesito practicar ejercicios",
  "🧩 No entiendo el tema",
  "⏱️ Tengo poco tiempo",
  "📈 Quiero mejorar mi rendimiento",
  "🔬 Necesito preparar un laboratorio o proyecto",
  "📄 Necesito realizar una lectura o trabajo escrito",
];

const NIVELES = ["Colegio", "Universidad", "Otra / Personalizada"] as const;
type Nivel = (typeof NIVELES)[number];

const MATERIAS_SUGERIDAS: Record<Nivel, string[]> = {
  Colegio: ["Matemáticas", "Física", "Química", "Biología", "Lengua Castellana", "Historia", "Inglés"],
  Universidad: ["Cálculo Diferencial", "Álgebra Lineal", "Física Mecánica", "Programación Orientada a Objetos", "Bases de Datos", "Economía"],
  "Otra / Personalizada": [],
};

const DURATION_PRESETS = [25, 40, 50, 60];

// Preferencias recordadas entre sesiones (solo comodidad: la app funciona sin ellas)
const CLAVE_NIVEL = "studia_nivel";
const CLAVE_CONTEXTO = "studia_ultimo_contexto";

function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}
function escribir(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor);
  } catch {}
}

const getMethodIcon = (metodo: string) => {
  if (metodo.includes("Active Recall")) return <RotateCw size={22} className="text-glacier-blue" />;
  if (metodo.includes("Feynman")) return <Sparkles size={22} className="text-cool-iris" />;
  if (metodo.includes("Pomodoro")) return <Clock size={22} className="text-amber-700" />;
  if (metodo.includes("Práctica")) return <Target size={22} className="text-sky-700" />;
  return <MoreHorizontal size={22} className="text-cool-iris" />;
};

type TemaW = { id: string; nombre: string; estado?: string; orden?: number | null };
type MateriaW = { id: string; nombre: string; temas?: TemaW[] };

/** Opción seleccionable (botón con aria-pressed). */
function Chip({
  activo,
  onClick,
  children,
  className = "",
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`min-h-11 px-4 py-2 rounded-2xl border text-sm font-medium text-left apple-tactile transition-colors ${
        activo
          ? "bg-glacier-blue text-white border-glacier-blue"
          : "bg-white text-arctic-slate border-black/[0.08] hover:bg-black/[0.03]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Nueva sesión en 2 pasos (antes 5): 1) qué estudiar (nivel recordado, materia y tema);
 * 2) cómo (situación, método recomendado, duración, objetivo y sonido). Si llega con materia y
 * tema (desde «Para hoy», un parcial o la ruta), empieza en el paso 2 con la última situación
 * elegida ya aplicada: basta con pulsar «Comenzar».
 */
export default function SessionWizard({
  initialMaterias,
  preMateriaId = "",
  preMateriaNombre = "",
  preTemaId = "",
  preTemaNombre = "",
}: {
  initialMaterias: MateriaW[];
  preMateriaId?: string;
  preMateriaNombre?: string;
  preTemaId?: string;
  preTemaNombre?: string;
}) {
  const router = useRouter();
  const reducido = useReducedMotion();
  const ids = useId();
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const enfocarAlEntrar = useRef(false);

  const preSeleccion = !!(preMateriaNombre && preTemaNombre);
  const [step, setStep] = useState<1 | 2>(preSeleccion ? 2 : 1);
  const [direccion, setDireccion] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nivel, setNivel] = useState<Nivel>("Universidad");
  const [materiaId, setMateriaId] = useState(preMateriaId);
  const [materiaNombre, setMateriaNombre] = useState(preMateriaNombre);
  const [temaId, setTemaId] = useState(preTemaId);
  const [temaNombre, setTemaNombre] = useState(preTemaNombre);
  const [materiaLibre, setMateriaLibre] = useState("");
  const [temaLibre, setTemaLibre] = useState("");
  const [temasRemotos, setTemasRemotos] = useState<TemaW[] | null>(null);

  const [contexto, setContexto] = useState<StudyContext | "">("");
  const [recomendacion, setRecomendacion] = useState<Recommendation | null>(null);
  const [origenRecomendacion, setOrigenRecomendacion] = useState<"ia" | "reglas">("reglas");
  const [pidiendo, setPidiendo] = useState(false);
  // 25 min por defecto: el bloque Pomodoro que promete la landing
  const [duracion, setDuracion] = useState(25);
  const [objetivo, setObjetivo] = useState("");

  const materiaActual = initialMaterias.find((m) => m.id === materiaId);
  const temas = (materiaActual?.temas ?? temasRemotos ?? [])
    .slice()
    .sort((a, b) => Number(a.estado === "completado") - Number(b.estado === "completado") || (a.orden ?? 9999) - (b.orden ?? 9999));

  // Nivel recordado
  useEffect(() => {
    const n = leer(CLAVE_NIVEL);
    if (n && (NIVELES as readonly string[]).includes(n)) setNivel(n as Nivel);
  }, []);

  // Temas de una materia que no vinieron con la lista inicial
  useEffect(() => {
    if (!materiaId || materiaActual?.temas) {
      setTemasRemotos(null);
      return;
    }
    fetch(`/api/materias/${materiaId}/temas`)
      .then((r) => r.json())
      .then((d) => setTemasRemotos(Array.isArray(d) ? d : []))
      .catch(() => setTemasRemotos([]));
  }, [materiaId, materiaActual?.temas]);

  // Al cambiar de paso, el foco va al título del paso nuevo cuando termina de entrar
  // (con AnimatePresence en modo "wait" el paso nuevo aún no existe al cambiar `step`)
  const alTerminarEntrada = (definicion: unknown) => {
    if (definicion === "centro" && enfocarAlEntrar.current) {
      enfocarAlEntrar.current = false;
      tituloRef.current?.focus();
    }
  };

  const pedirRecomendacion = async (ctx: StudyContext) => {
    setContexto(ctx);
    escribir(CLAVE_CONTEXTO, ctx);
    setPidiendo(true);
    setRecomendacion(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("/api/sesiones/recomendacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // El nivel recordado se lee directo: en la carga inicial el estado aún puede no tenerlo
        body: JSON.stringify({ nivel_educativo: leer(CLAVE_NIVEL) || nivel, materia_nombre: materiaNombre, tema_nombre: temaNombre, contexto: ctx }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("API falló o rate limit excedido");
      setRecomendacion(await res.json());
      setOrigenRecomendacion("ia");
    } catch (err) {
      console.warn("AI Recommendation failed, falling back to local engine:", err);
      setRecomendacion(getRecommendation(nivel, materiaNombre, ctx));
      setOrigenRecomendacion("reglas");
    } finally {
      setPidiendo(false);
    }
  };

  // En el paso 2, si ya se eligió una situación antes, se aplica sola
  useEffect(() => {
    if (step !== 2 || contexto) return;
    const ultimo = leer(CLAVE_CONTEXTO);
    if (ultimo && (CONTEXTOS as string[]).includes(ultimo)) void pedirRecomendacion(ultimo as StudyContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const irA = (paso: 1 | 2) => {
    enfocarAlEntrar.current = true;
    setDireccion(paso > step ? 1 : -1);
    setStep(paso);
  };

  const elegirMateria = (id: string, nombre: string) => {
    setMateriaId(id);
    setMateriaNombre(nombre);
    setTemaId("");
    setTemaNombre("");
  };

  const elegirNivel = (n: Nivel) => {
    setNivel(n);
    escribir(CLAVE_NIVEL, n);
  };

  const handleStart = async () => {
    if (!recomendacion) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nivel_educativo: nivel,
          materia_id: materiaId || null,
          materia_nombre: !materiaId ? materiaNombre : undefined,
          tema_id: temaId || null,
          tema_nombre: !temaId ? temaNombre : undefined,
          contexto,
          metodo_recomendado: recomendacion.metodo,
          metodo_utilizado: recomendacion.metodo,
          objetivo,
          duracion_planificada_minutos: duracion,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No pudimos iniciar la sesión. Inténtalo de nuevo.");
      }
      const sessionData = await res.json();
      router.push(`/sesion/activa/${sessionData.id}`);
    } catch (err: any) {
      setError(typeof err.message === "string" ? err.message : "No pudimos iniciar la sesión.");
      setLoading(false);
    }
  };

  const puedeContinuar = !!materiaNombre.trim() && !!temaNombre.trim();
  const duracionValida = Number.isInteger(duracion) && duracion >= 1 && duracion <= 600;

  const variantes = {
    entra: (d: number) => (reducido ? { opacity: 0 } : { opacity: 0, x: 24 * d }),
    centro: { opacity: 1, x: 0 },
    sale: (d: number) => (reducido ? { opacity: 0 } : { opacity: 0, x: -24 * d }),
  };

  const etiquetaSeccion = "block text-sm font-semibold text-arctic-slate mb-2.5";
  const claseInput =
    "w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate";

  return (
    <div className="apple-card p-6 md:p-10 max-w-2xl mx-auto shadow-apple-md overflow-hidden">
      {/* Progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-arctic-secondary mb-2.5 min-h-11">
          {step === 2 ? (
            <button type="button" onClick={() => irA(1)} className="btn-apple-ghost text-sm -ml-3 min-h-11 apple-tactile">
              <ChevronLeft size={16} aria-hidden="true" />
              <span>Atrás</span>
            </button>
          ) : (
            <span />
          )}
          <span className="font-semibold">Paso {step} de 2</span>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= i ? "bg-glacier-blue" : "bg-black/[0.07]"}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direccion} initial={false}>
        {step === 1 ? (
          <motion.div
            key="paso1"
            custom={direccion}
            variants={variantes}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={reducido ? fundido : resorte}
            onAnimationComplete={alTerminarEntrada}
            className="space-y-8"
          >
            <div>
              <h2 ref={tituloRef} tabIndex={-1} className="apple-large-title text-arctic-slate outline-none">
                ¿Qué vas a estudiar?
              </h2>
              <p className="text-sm text-arctic-secondary mt-1">Elige la materia y el tema de esta sesión.</p>
            </div>

            <div role="group" aria-labelledby={`${ids}-nivel`}>
              <span id={`${ids}-nivel`} className={etiquetaSeccion}>
                Nivel
              </span>
              <div className="apple-segmented w-full sm:w-auto">
                {NIVELES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={nivel === n}
                    onClick={() => elegirNivel(n)}
                    className={`flex-1 sm:flex-none min-h-11 px-4 rounded-[10px] text-sm font-medium transition-colors ${
                      nivel === n ? "bg-white text-arctic-slate shadow-apple-sm" : "text-arctic-secondary hover:text-arctic-slate"
                    }`}
                  >
                    {n === "Otra / Personalizada" ? "Otro" : n}
                  </button>
                ))}
              </div>
            </div>

            <div role="group" aria-labelledby={`${ids}-materia`}>
              <span id={`${ids}-materia`} className={etiquetaSeccion}>
                Materia
              </span>
              <div className="flex flex-wrap gap-2">
                {(initialMaterias.length > 0
                  ? initialMaterias.map((m) => ({ id: m.id, nombre: m.nombre }))
                  : MATERIAS_SUGERIDAS[nivel].map((nombre) => ({ id: "", nombre }))
                ).map((m) => (
                  <Chip
                    key={m.id || m.nombre}
                    activo={materiaNombre === m.nombre && materiaId === m.id && !materiaLibre}
                    onClick={() => {
                      setMateriaLibre("");
                      elegirMateria(m.id, m.nombre);
                    }}
                  >
                    {m.nombre}
                  </Chip>
                ))}
              </div>
              <label htmlFor={`${ids}-materia-libre`} className="block text-xs text-arctic-secondary mt-3 mb-1.5">
                ¿Otra materia? Escríbela
              </label>
              <input
                id={`${ids}-materia-libre`}
                type="text"
                value={materiaLibre}
                onChange={(e) => {
                  setMateriaLibre(e.target.value);
                  elegirMateria("", e.target.value);
                }}
                placeholder="Ej. Estadística, Historia del arte…"
                className={claseInput}
              />
            </div>

            {materiaNombre.trim() && (
              <div role="group" aria-labelledby={`${ids}-tema`}>
                <span id={`${ids}-tema`} className={etiquetaSeccion}>
                  Tema de {materiaNombre}
                </span>
                {temas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {temas.map((t) => (
                      <Chip
                        key={t.id}
                        activo={temaId === t.id}
                        onClick={() => {
                          setTemaLibre("");
                          setTemaId(t.id);
                          setTemaNombre(t.nombre);
                        }}
                        className={t.estado === "completado" && temaId !== t.id ? "text-arctic-secondary" : ""}
                      >
                        {t.nombre}
                        {t.estado === "completado" && <span className="sr-only"> (completado)</span>}
                      </Chip>
                    ))}
                  </div>
                )}
                <label htmlFor={`${ids}-tema-libre`} className="block text-xs text-arctic-secondary mb-1.5">
                  {temas.length > 0 ? "¿Otro tema? Escríbelo" : "Escribe el tema"}
                </label>
                <input
                  id={`${ids}-tema-libre`}
                  type="text"
                  value={temaLibre}
                  onChange={(e) => {
                    setTemaLibre(e.target.value);
                    setTemaId("");
                    setTemaNombre(e.target.value);
                  }}
                  placeholder="Ej. Derivadas parciales, Segunda Guerra Mundial…"
                  className={claseInput}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => irA(2)}
              disabled={!puedeContinuar}
              className="btn-apple-primary w-full min-h-12 apple-tactile disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="paso2"
            custom={direccion}
            variants={variantes}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={reducido ? fundido : resorte}
            onAnimationComplete={alTerminarEntrada}
            className="space-y-8"
          >
            <div>
              <h2 ref={tituloRef} tabIndex={-1} className="apple-large-title text-arctic-slate outline-none">
                ¿Cómo quieres estudiar?
              </h2>
              <p className="text-sm text-arctic-secondary mt-1">
                {materiaNombre} · {temaNombre}
              </p>
            </div>

            <div role="group" aria-labelledby={`${ids}-contexto`}>
              <span id={`${ids}-contexto`} className={etiquetaSeccion}>
                ¿Cuál es tu situación?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTEXTOS.map((c) => (
                  <Chip key={c} activo={contexto === c} onClick={() => pedirRecomendacion(c)} className="flex items-center gap-2">
                    {/* El emoji es decorativo: fuera del nombre accesible */}
                    <span aria-hidden="true">{c.split(" ")[0]}</span>
                    <span>{c.split(" ").slice(1).join(" ")}</span>
                  </Chip>
                ))}
              </div>
            </div>

            {/* Método recomendado */}
            <div aria-live="polite" aria-busy={pidiendo}>
              {pidiendo ? (
                <div className="rounded-2xl border border-black/[0.06] p-6 space-y-3">
                  <p className="text-sm font-semibold text-arctic-slate">Buscando el mejor método para ti…</p>
                  <div aria-hidden="true" className="h-4 w-2/3 rounded-lg apple-shimmer" />
                  <div aria-hidden="true" className="h-3 w-full rounded-lg apple-shimmer" />
                  <div aria-hidden="true" className="h-3 w-5/6 rounded-lg apple-shimmer" />
                </div>
              ) : recomendacion ? (
                <div className="rounded-2xl border border-cool-iris/20 bg-gradient-to-br from-white to-cool-iris/[0.03] p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div aria-hidden="true" className="p-2.5 rounded-2xl bg-cool-iris/10 shrink-0">
                      {getMethodIcon(recomendacion.metodo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-cool-iris">
                        {origenRecomendacion === "ia" ? "Método sugerido por IA" : "Método sugerido"}
                      </p>
                      <h3 className="apple-title-3 text-arctic-slate mt-0.5">{recomendacion.metodo}</h3>
                      <p className="text-sm text-arctic-secondary mt-1">{recomendacion.justificacion}</p>
                      <ol className="mt-4 pt-4 border-t border-black/[0.06] space-y-2">
                        {recomendacion.pasos.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-arctic-slate">
                            <span className="text-glacier-blue font-bold tabular-nums">{i + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-arctic-secondary">Elige tu situación para ver el método recomendado.</p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div role="group" aria-labelledby={`${ids}-duracion`}>
                <span id={`${ids}-duracion`} className={etiquetaSeccion}>
                  Duración (minutos)
                </span>
                <div className="flex gap-2 mb-2">
                  {DURATION_PRESETS.map((p) => (
                    <Chip key={p} activo={duracion === p} onClick={() => setDuracion(p)} className="flex-1 text-center px-2 tabular-nums">
                      {p}
                    </Chip>
                  ))}
                </div>
                <label htmlFor={`${ids}-duracion-libre`} className="block text-xs text-arctic-secondary mb-1.5">
                  Otra duración
                </label>
                <input
                  id={`${ids}-duracion-libre`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={600}
                  value={duracion}
                  onChange={(e) => setDuracion(Number(e.target.value))}
                  aria-invalid={!duracionValida}
                  className={`${claseInput} tabular-nums`}
                />
              </div>
              <div>
                <label htmlFor={`${ids}-objetivo`} className={etiquetaSeccion}>
                  Objetivo (opcional)
                </label>
                <input
                  id={`${ids}-objetivo`}
                  type="text"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ej. Resolver 5 ejercicios clave"
                  className={claseInput}
                />
              </div>
            </div>

            {/* Sonido opcional: se puede elegir aquí o después, desde la sesión */}
            <section aria-labelledby={`${ids}-sonido`} className="space-y-3">
              <div>
                <h3 id={`${ids}-sonido`} className="text-sm font-semibold text-arctic-slate">
                  Sonido de fondo (opcional)
                </h3>
                <p className="text-xs text-arctic-secondary mt-0.5">
                  Toca uno para escucharlo. Seguirá sonando durante la sesión y no afecta el temporizador.
                </p>
              </div>
              <SelectorAmbientes compacto />
            </section>

            {error && (
              <div role="alert" className="p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleStart}
              disabled={loading || pidiendo || !recomendacion || !duracionValida}
              className="btn-apple-primary w-full min-h-12 apple-tactile disabled:opacity-40"
            >
              <span>{loading ? "Iniciando…" : `Comenzar sesión de ${duracion} min`}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
