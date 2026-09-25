"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudyContext, getRecommendation, Recommendation } from "@/lib/recommendationEngine";
import { ArrowRight, RotateCw, Clock, X, MoreHorizontal, Sparkles, ChevronLeft, Target } from "lucide-react";

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
  "📄 Necesito realizar una lectura o trabajo escrito"
];

const PREDEFINED_SUBJECTS = {
  Colegio: ["Matemáticas", "Física", "Química", "Biología", "Lengua Castellana", "Historia", "Geografía", "Inglés", "Filosofía"],
  Universidad: ["Cálculo Diferencial", "Álgebra Lineal", "Física Mecánica", "Programación Orientada a Objetos", "Estructuras de Datos", "Bases de Datos", "Economía", "Psicología", "Derecho"],
  "Otra / Personalizada": []
};

const DURATION_PRESETS = [25, 40, 50, 60];

// Icons mapping for visual identity of methods
const getMethodIcon = (metodo: string) => {
  if (metodo.includes("Active Recall")) return <RotateCw size={22} className="text-acento" />;
  if (metodo.includes("Feynman")) return <Sparkles size={22} className="text-acento" />;
  if (metodo.includes("Pomodoro")) return <Clock size={22} className="text-aviso" />;
  if (metodo.includes("Práctica")) return <Target size={22} className="text-acento" />;
  return <MoreHorizontal size={22} className="text-acento" />;
};

export default function SessionWizard({ 
  initialMaterias,
  initialStep = 1,
  preNivel = "",
  preMateriaId = "",
  preMateriaNombre = "",
  preTemaId = "",
  preTemaNombre = ""
}: { 
  initialMaterias: any[];
  initialStep?: number;
  preNivel?: string;
  preMateriaId?: string;
  preMateriaNombre?: string;
  preTemaId?: string;
  preTemaNombre?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [nivel, setNivel] = useState<string>(preNivel);
  
  const [materiaId, setMateriaId] = useState<string>(preMateriaId);
  const [materiaNombre, setMateriaNombre] = useState<string>(preMateriaNombre);
  const [customMateria, setCustomMateria] = useState<string>("");

  const [temaId, setTemaId] = useState<string>(preTemaId);
  const [temaNombre, setTemaNombre] = useState<string>(preTemaNombre);
  const [customTema, setCustomTema] = useState<string>("");

  const [contexto, setContexto] = useState<StudyContext | "">("");
  
  const [recomendacion, setRecomendacion] = useState<Recommendation | null>(null);
  // Origen de la recomendación, para decirle al estudiante de dónde viene
  const [origenRecomendacion, setOrigenRecomendacion] = useState<"ia" | "reglas">("reglas");
  // 25 min por defecto: el bloque Pomodoro que promete la landing
  const [duracion, setDuracion] = useState<number>(25);
  const [objetivo, setObjetivo] = useState<string>("");

  const [temasLocales, setTemasLocales] = useState<any[]>([]);

  // Fetch temas when materiaId changes
  useEffect(() => {
    if (materiaId) {
      fetch(`/api/materias/${materiaId}/temas`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setTemasLocales(data);
        });
    } else {
      setTemasLocales([]);
    }
  }, [materiaId]);

  // El valor recién elegido se pasa como argumento: setContexto(c) aún no se ha aplicado
  // cuando handleNext se ejecuta en el mismo clic, y se enviaba el contexto vacío (400).
  const handleNext = async (contextoElegido?: StudyContext) => {
    if (step === 4) {
      const ctx = contextoElegido ?? contexto;
      setLoading(true);
      const matName = materiaId ? initialMaterias.find(m => m.id === materiaId)?.nombre : (customMateria || materiaNombre);
      const temName = customTema || temaNombre;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch("/api/sesiones/recomendacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nivel_educativo: nivel,
            materia_nombre: matName,
            tema_nombre: temName,
            contexto: ctx
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error("API falló o rate limit excedido");
        }
        
        const aiRec = await res.json();
        setRecomendacion(aiRec);
        setOrigenRecomendacion("ia");
      } catch (err) {
        console.warn("AI Recommendation failed, falling back to local engine:", err);
        const localRec = getRecommendation(nivel, matName || "", ctx as StudyContext);
        setRecomendacion(localRec);
        setOrigenRecomendacion("reglas");
      } finally {
        setLoading(false);
        setStep(s => s + 1);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    const finalMateriaName = customMateria || materiaNombre;
    const finalTemaName = customTema || temaNombre;

    try {
      const res = await fetch("/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nivel_educativo: nivel,
          materia_id: materiaId || null,
          materia_nombre: !materiaId ? finalMateriaName : undefined,
          tema_id: temaId || null,
          tema_nombre: !temaId ? finalTemaName : undefined,
          contexto,
          metodo_recomendado: recomendacion?.metodo,
          metodo_utilizado: recomendacion?.metodo, 
          objetivo,
          duracion_planificada_minutos: duracion,
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error iniciando sesión");
      }

      const sessionData = await res.json();
      router.push(`/sesion/activa/${sessionData.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="tarjeta p-6 md:p-10 max-w-2xl mx-auto shadow-2">
      
      {/* Apple Setup Assistant Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-tinta-2 mb-2.5">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 text-tinta-2 hover:text-tinta transition-colors tactil"
              >
                <ChevronLeft size={14} />
                <span>Atrás</span>
              </button>
            )}
            <span className="font-semibold text-tinta-3">Paso {step} de 5</span>
          </div>
          <span className="text-xs font-medium text-tinta-3">Configuración de Sesión</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                step >= i ? "bg-acento" : "bg-hundido"
              }`} 
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="border border-error/30 bg-error/10 text-error p-3 rounded-xl mb-6 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Step 1: Nivel */}
      {step === 1 && (
        <div className="space-y-6 duration-300">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-tinta">
              ¿En qué nivel te encuentras?
            </h2>
            <p className="text-sm text-tinta-2 mt-1">
              Selecciona tu ámbito actual para calibrar las recomendaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["Colegio", "Universidad", "Otra / Personalizada"].map(n => (
              <button 
                key={n}
                onClick={() => { setNivel(n); handleNext(); }}
                className="tarjeta p-5 text-left font-medium transition-all tactil border border-linea hover:border-acento/30 hover:bg-fondo/50"
              >
                <div className="text-base font-semibold text-tinta tracking-tight">{n}</div>
                <div className="text-xs text-tinta-2 mt-1">
                  {n === "Colegio" ? "Secundaria / Bachillerato" : n === "Universidad" ? "Pregrado o Posgrado" : "Autodidacta o Certificación"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Materia */}
      {step === 2 && (
        <div className="space-y-6 duration-300">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-tinta">
              ¿Qué materia vas a estudiar?
            </h2>
            <p className="text-sm text-tinta-2 mt-1">
              Elige una de tus materias registradas o una sugerida para tu nivel.
            </p>
          </div>
          
          {initialMaterias.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-tinta-3 uppercase tracking-wider mb-2.5">
                Tus materias registradas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {initialMaterias.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => { setMateriaId(m.id); setMateriaNombre(m.nombre); handleNext(); }} 
                    className="p-3 sm:p-3.5 rounded-xl border border-linea bg-fondo/60 text-left hover:border-acento/30 hover:bg-superficie transition-all tactil"
                  >
                    <div className="font-semibold text-sm text-tinta tracking-tight truncate">{m.nombre}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {nivel !== "Otra / Personalizada" && (
            <div>
              <h3 className="text-xs font-semibold text-tinta-3 uppercase tracking-wider mb-2.5">
                Sugerencias ({nivel})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PREDEFINED_SUBJECTS[nivel as keyof typeof PREDEFINED_SUBJECTS].map(m => (
                  <button 
                    key={m} 
                    onClick={() => { setMateriaId(""); setMateriaNombre(m); handleNext(); }} 
                    className="p-2.5 rounded-xl border border-linea bg-fondo/40 text-left hover:bg-superficie text-xs font-medium text-tinta-2 hover:text-tinta transition-all tactil truncate"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-linea">
            <h3 className="text-xs font-semibold text-tinta-3 uppercase tracking-wider mb-2">
              Otra materia diferente
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Nombre de la materia..." 
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-linea bg-fondo text-sm text-tinta outline-none focus:border-acento transition-all" 
                value={customMateria} 
                onChange={e => setCustomMateria(e.target.value)} 
              />
              <button 
                onClick={() => { setMateriaId(""); setMateriaNombre(customMateria); handleNext(); }} 
                disabled={!customMateria.trim()} 
                className="w-full sm:w-auto btn-secundario text-xs px-5 py-2.5 disabled:opacity-40 tactil"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Tema */}
      {step === 3 && (
        <div className="space-y-6 duration-300">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-tinta">
              ¿Cuál es el tema específico?
            </h2>
            <p className="text-sm text-tinta-2 mt-1">
              Selecciona un tema existente o escribe lo que necesitas aprender hoy.
            </p>
          </div>
          
          {temasLocales.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-tinta-3 uppercase tracking-wider mb-2.5">
                Temas en {materiaNombre}
              </h3>
              <div className="grid gap-2">
                {temasLocales.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => { setTemaId(t.id); setTemaNombre(t.nombre); handleNext(); }} 
                    className="p-3.5 rounded-xl border border-linea bg-fondo/60 text-left hover:border-acento/30 hover:bg-superficie transition-all flex justify-between items-center tactil"
                  >
                    <span className="font-semibold text-sm text-tinta">{t.nombre}</span>
                    <span className="text-xs uppercase font-semibold text-tinta-3 px-2 py-0.5 rounded-full bg-hundido">
                      {t.tipo_contenido || "Tema"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-tinta-3 uppercase tracking-wider mb-2">
              Escribir un tema nuevo
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Ej. Derivadas parciales, Segunda Guerra Mundial..." 
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-linea bg-fondo text-sm text-tinta outline-none focus:border-acento transition-all" 
                value={customTema} 
                onChange={e => setCustomTema(e.target.value)} 
              />
              <button 
                onClick={() => { setTemaId(""); setTemaNombre(customTema); handleNext(); }} 
                disabled={!customTema.trim()} 
                className="w-full sm:w-auto btn-secundario text-xs px-5 py-2.5 disabled:opacity-40 tactil"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contexto */}
      {step === 4 && (
        <div className="space-y-6 duration-300">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-tinta">
              ¿Cuál es tu objetivo o situación?
            </h2>
            <p className="text-sm text-tinta-2 mt-1">
              Esto permite recomendarte el método de estudio cognitivo más efectivo.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-9 h-9 border-2 border-linea border-t-acento rounded-full animate-spin" />
              <p className="text-sm font-semibold text-tinta">
                Sintetizando método con IA...
              </p>
              <p className="text-xs text-tinta-2">Analizando el mejor marco de trabajo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {CONTEXTOS.map(c => (
                <button 
                  key={c} 
                  onClick={() => { setContexto(c); handleNext(c); }} 
                  className="p-3.5 min-h-11 rounded-xl border border-linea bg-fondo/60 text-left hover:border-acento/30 hover:bg-superficie transition-all text-sm font-medium text-tinta tactil flex items-center gap-2"
                >
                  {/* El emoji es decorativo: fuera del nombre accesible */}
                  <span aria-hidden="true">{c.split(" ")[0]}</span>
                  <span>{c.split(" ").slice(1).join(" ")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Recomendación y Planificación */}
      {step === 5 && recomendacion && (
        <div className="space-y-7 duration-400">
          <div>
            <span className="text-xs font-semibold text-acento uppercase tracking-wider">
              {origenRecomendacion === "ia" ? "Sugerido por IA" : "Sugerido por reglas de estudio"}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-tinta mt-0.5">
              Tu método sugerido
            </h2>
          </div>

          {/* Apple Intelligence Card en Cristal Blanco */}
          <div className="tarjeta p-6 border border-acento/20 bg-gradient-to-br from-superficie to-acento/[0.03]">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-acento/10 text-acento shrink-0 shadow-1">
                {getMethodIcon(recomendacion.metodo)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-tinta tracking-tight">
                  {recomendacion.metodo}
                </h3>
                <p className="text-xs text-tinta-2 mt-1 leading-relaxed">
                  {recomendacion.justificacion}
                </p>

                <div className="mt-4 pt-4 border-t border-linea space-y-2">
                  <span className="text-xs font-semibold text-tinta-3 uppercase tracking-wider block">
                    Pasos a seguir
                  </span>
                  {recomendacion.pasos.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-tinta">
                      <span className="text-acento font-bold">{i + 1}.</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Duration & Objective */}
          <div className="space-y-4 p-5 rounded-2xl bg-fondo border border-linea">
            <div>
              <label className="block text-xs font-semibold text-tinta-2 mb-2">
                Duración de la sesión (minutos)
              </label>
              <div className="flex items-center gap-2 mb-3">
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDuracion(p)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all tactil ${
                      duracion === p
                        ? "bg-acento text-sobre-acento shadow-1"
                        : "bg-superficie text-tinta-2 border border-linea hover:bg-superficie"
                    }`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={duracion} 
                onChange={e => setDuracion(Number(e.target.value))} 
                className="w-full px-4 py-2.5 rounded-xl border border-linea bg-superficie text-sm text-tinta outline-none focus:border-acento font-mono tabular-nums" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-tinta-2 mb-1.5">
                Objetivo principal de la sesión (Opcional)
              </label>
              <input 
                type="text" 
                placeholder="Ej. Resolver 5 ejercicios clave o resumir el capítulo 3" 
                value={objetivo} 
                onChange={e => setObjetivo(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl border border-linea bg-superficie text-sm text-tinta outline-none focus:border-acento" 
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
            <button 
              onClick={() => setStep(1)} 
              className="btn-fantasma text-xs px-4 py-2.5 tactil"
            >
              Reiniciar configuración
            </button>
            <button 
              onClick={handleStart} 
              disabled={loading} 
              className="btn-primario flex-1 w-full text-xs py-3 px-6 font-semibold tactil shadow-1"
            >
              <span>{loading ? "Iniciando sesión..." : "Comenzar sesión de estudio"}</span>
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
