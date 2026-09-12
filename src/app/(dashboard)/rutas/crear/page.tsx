"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Clock, Target, BookOpen, ChevronDown } from "lucide-react";

export default function CrearRutaIAPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [nivelEducativo, setNivelEducativo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tiempoDiario, setTiempoDiario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generar-ruta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          nivelEducativo,
          objetivo,
          tiempoDiario
        }),
      });

      if (!res.ok) {
        throw new Error("No pudimos generar la ruta. Intenta ser más específico.");
      }

      const data = await res.json();
      
      // Store the generated route in localStorage to pass it to the preview screen
      localStorage.setItem("studia_pending_route", JSON.stringify({
        ...data,
        prompt_original: prompt
      }));
      
      router.push("/rutas/preview");

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 text-electric-periwinkle mb-2">
        <Sparkles size={24} />
        <h1 className="text-3xl font-display font-bold text-text-primary">Inteligencia de Ruta</h1>
      </div>
      <p className="text-text-secondary text-lg">
        La IA organizará los temas en el orden ideal para que llegues a tu objetivo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Main Prompt */}
        <div className="surface-elevated p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-electric-periwinkle/5 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <label className="block text-sm uppercase tracking-widest font-bold text-text-secondary mb-4 relative z-10">
            ¿Qué necesitas aprender?
          </label>
          <textarea
            required
            autoFocus
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej. Tengo un parcial de cálculo diferencial sobre límites el viernes..."
            className="w-full h-32 bg-transparent text-xl md:text-2xl font-medium outline-none resize-none relative z-10 placeholder:text-white/20"
          ></textarea>
        </div>

        {/* Optional Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="surface-panel p-5">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-text-secondary mb-3">
              <BookOpen size={14} /> Nivel (Opcional)
            </label>
            <div className="relative">
              <select 
                value={nivelEducativo}
                onChange={(e) => setNivelEducativo(e.target.value)}
                className="w-full appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
              >
                <option value="">Selecciona...</option>
                <option value="Colegio">Colegio</option>
                <option value="Universidad">Universidad</option>
                <option value="Técnico / Tecnológico">Técnico / Tecnológico</option>
                <option value="Aprendizaje Personal">Aprendizaje Personal</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-text-secondary mb-3">
              <Target size={14} /> Objetivo (Opcional)
            </label>
            <div className="relative">
              <select 
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
              >
                <option value="">Selecciona...</option>
                <option value="Aprender desde cero">Aprender desde cero</option>
                <option value="Prepararme para un parcial">Preparar un parcial</option>
                <option value="Repasar conceptos">Repasar conceptos</option>
                <option value="Profundizar en el tema">Profundizar</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-text-secondary mb-3">
              <Clock size={14} /> Tiempo (Opcional)
            </label>
            <div className="relative">
              <select 
                value={tiempoDiario}
                onChange={(e) => setTiempoDiario(e.target.value)}
                className="w-full appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
              >
                <option value="">Selecciona...</option>
                <option value="15 minutos al día">15 min/día</option>
                <option value="30 minutos al día">30 min/día</option>
                <option value="1 hora al día">1 hora/día</option>
                <option value="2+ horas al día">2+ horas/día</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 border border-warm-coral/30 text-warm-coral bg-warm-coral/5 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !prompt}
            className="btn-action flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles size={18} className="animate-pulse" /> Generando plan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Crear plan de estudio <ArrowRight size={18} />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
