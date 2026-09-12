"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudyContext, getRecommendation, Recommendation } from "@/lib/recommendationEngine";
import { ArrowRight, RotateCw, Clock, X, MoreHorizontal } from "lucide-react";

const CONTEXTOS: StudyContext[] = [
  "📝 Tengo un examen próximamente",
  "📚 Necesito aprender un tema desde cero",
  "🔄 Necesito repasar",
  "🧠 Necesito memorizar información",
  "✏️ Necesito practicar ejercicios",
  "🧩 No entiendo el tema",
  "⏱️ Tengo poco tiempo",
  "📈 Quiero mejorar mi rendimiento",
  "🎯 Preparación para parcial, quiz o evaluación",
  "🔬 Necesito preparar un laboratorio o proyecto",
  "📄 Necesito realizar una lectura o trabajo escrito"
];

const PREDEFINED_SUBJECTS = {
  Colegio: ["Matemáticas", "Física", "Química", "Biología", "Lengua Castellana", "Historia", "Geografía", "Inglés", "Filosofía"],
  Universidad: ["Cálculo Diferencial", "Álgebra Lineal", "Física Mecánica", "Programación Orientada a Objetos", "Estructuras de Datos", "Bases de Datos", "Economía", "Psicología", "Derecho"],
  "Otra / Personalizada": []
};

// Icons mapping for visual identity of methods
const getMethodIcon = (metodo: string) => {
  if (metodo.includes("Active Recall")) return <RotateCw size={24} className="text-signal-lime" />;
  if (metodo.includes("Feynman")) return <ArrowRight size={24} className="text-electric-lavender" />;
  if (metodo.includes("Pomodoro")) return <Clock size={24} className="text-warm-coral" />;
  if (metodo.includes("Práctica")) return <X size={24} className="text-electric-periwinkle" />;
  return <MoreHorizontal size={24} className="text-electric-lavender" />;
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
  const [duracion, setDuracion] = useState<number>(40);
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

  const handleNext = async () => {
    if (step === 4) {
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
            contexto: contexto
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error("API falló o rate limit excedido");
        }
        
        const aiRec = await res.json();
        setRecomendacion(aiRec);
      } catch (err) {
        console.warn("AI Recommendation failed, falling back to local engine:", err);
        const localRec = getRecommendation(nivel, matName || "", contexto as StudyContext);
        setRecomendacion(localRec);
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
    <div className="surface-panel p-6 md:p-10 mt-8 max-w-2xl mx-auto">
      {/* Route Progress */}
      <div className="flex items-center mb-12 relative">
        <div className="absolute top-1.5 left-0 w-full h-[2px] bg-white/5 -z-10"></div>
        <div className="flex justify-between w-full relative z-10">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full transition-colors ${step >= i ? 'bg-electric-periwinkle shadow-[0_0_8px_rgba(106,146,229,0.5)]' : 'bg-deep-ink border border-white/20'}`} />
          ))}
        </div>
      </div>

      {error && <div className="border border-warm-coral/30 text-warm-coral p-4 rounded-md mb-6">{error}</div>}

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-display font-bold">¿Dónde estudias?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Colegio", "Universidad", "Otra / Personalizada"].map(n => (
              <button 
                key={n}
                onClick={() => { setNivel(n); handleNext(); }}
                className="p-6 border border-white/10 rounded-lg hover:border-electric-periwinkle hover:bg-electric-periwinkle/5 text-left font-medium transition-colors"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-display font-bold">¿Qué materia vas a estudiar?</h2>
          
          {initialMaterias.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-4">Tus materias</h3>
              <div className="grid grid-cols-2 gap-3">
                {initialMaterias.map(m => (
                  <button key={m.id} onClick={() => { setMateriaId(m.id); setMateriaNombre(m.nombre); handleNext(); }} className="p-4 border border-white/10 rounded-lg text-left hover:bg-white/5 transition-colors">
                    {m.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {nivel !== "Otra / Personalizada" && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-4">Sugerencias ({nivel})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PREDEFINED_SUBJECTS[nivel as keyof typeof PREDEFINED_SUBJECTS].map(m => (
                  <button key={m} onClick={() => { setMateriaId(""); setMateriaNombre(m); handleNext(); }} className="p-3 border border-white/10 rounded-lg text-left hover:bg-white/5 text-sm transition-colors">
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-4">Otra materia</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="Nombre de la materia..." className="flex-1 p-3 rounded-lg border border-white/10 bg-deep-elevated focus:border-electric-periwinkle outline-none transition-colors" value={customMateria} onChange={e => setCustomMateria(e.target.value)} />
              <button onClick={() => { setMateriaId(""); setMateriaNombre(customMateria); handleNext(); }} disabled={!customMateria} className="bg-white/10 text-text-primary px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors">Siguiente</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-display font-bold">¿Qué tema vas a estudiar?</h2>
          
          {temasLocales.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-4">Tus temas</h3>
              <div className="grid gap-3">
                {temasLocales.map(t => (
                  <button key={t.id} onClick={() => { setTemaId(t.id); setTemaNombre(t.nombre); handleNext(); }} className="p-4 border border-white/10 rounded-lg text-left hover:bg-white/5 transition-colors flex justify-between items-center">
                    <span>{t.nombre}</span>
                    <span className="opacity-50 text-xs uppercase tracking-wider">{t.tipo_contenido}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold mb-4">Escribir un tema nuevo</h3>
            <div className="flex gap-3">
              <input type="text" placeholder="Ej. Derivadas, Segunda Guerra Mundial..." className="flex-1 p-3 rounded-lg border border-white/10 bg-deep-elevated focus:border-electric-periwinkle outline-none transition-colors" value={customTema} onChange={e => setCustomTema(e.target.value)} />
              <button onClick={() => { setTemaId(""); setTemaNombre(customTema); handleNext(); }} disabled={!customTema} className="bg-white/10 text-text-primary px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors">Siguiente</button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-display font-bold">¿Cómo estás hoy?</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-12 h-12 border-2 border-white/10 border-t-electric-periwinkle rounded-full animate-spin"></div>
              <p className="font-medium text-electric-periwinkle">Preparando tu sesión...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CONTEXTOS.map(c => (
                <button key={c} onClick={() => { setContexto(c); handleNext(); }} className="p-4 border border-white/10 rounded-lg text-left hover:border-electric-periwinkle hover:bg-electric-periwinkle/5 transition-colors text-sm">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 5 && recomendacion && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center space-y-2">
            <h2 className="text-sm uppercase tracking-widest text-text-secondary font-bold">Tu método recomendado</h2>
          </div>

          <div className="surface-elevated p-8 border-l-4 border-l-electric-lavender flex gap-6 items-start">
            <div className="mt-1 bg-white/5 p-3 rounded-full">
              {getMethodIcon(recomendacion.metodo)}
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-electric-lavender mb-3">{recomendacion.metodo}</h3>
              <p className="mb-6 font-medium text-text-secondary leading-relaxed">{recomendacion.justificacion}</p>
              <ol className="space-y-3 opacity-90 text-sm border-t border-white/5 pt-6">
                {recomendacion.pasos.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-electric-lavender font-bold">{i + 1}.</span> 
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 p-6 border border-white/5 rounded-xl bg-black/20">
            <div>
              <label className="block text-sm uppercase tracking-widest text-text-secondary font-bold mb-3">Duración (minutos)</label>
              <input type="number" value={duracion} onChange={e => setDuracion(Number(e.target.value))} className="w-full p-4 rounded-lg border border-white/10 bg-deep-elevated focus:border-electric-periwinkle outline-none font-display text-xl transition-colors" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-widest text-text-secondary font-bold mb-3">Objetivo principal</label>
              <input type="text" placeholder="Ej. Resolver 5 ejercicios" value={objetivo} onChange={e => setObjetivo(e.target.value)} className="w-full p-4 rounded-lg border border-white/10 bg-deep-elevated focus:border-electric-periwinkle outline-none font-display transition-colors" />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
            <button onClick={() => setStep(1)} className="px-6 py-4 text-text-secondary hover:text-white transition-colors w-full sm:w-auto font-medium">Volver al inicio</button>
            <button onClick={handleStart} disabled={loading} className="btn-action flex-1 w-full flex items-center justify-center gap-2">
              {loading ? "Preparando sesión..." : "Empezar sesión"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
