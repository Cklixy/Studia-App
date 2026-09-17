"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, Navigation, Zap } from "lucide-react";

export default function RutaPreviewPage() {
  const router = useRouter();
  const [routeData, setRouteData] = useState<any>(null);
  const [temas, setTemas] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("studia_pending_route");
    if (!data) {
      router.push("/rutas/crear");
      return;
    }
    const parsedData = JSON.parse(data);
    setRouteData(parsedData);
    setTemas(parsedData.temas.map((t: any, idx: number) => ({ ...t, selected: true, originalIndex: idx })));
  }, [router]);

  const handleSaveRoute = async () => {
    setSaving(true);
    setError(null);
    try {
      // Filtrar solo los temas seleccionados y respetar el orden del array actual
      const temasAEnviar = temas.filter(t => t.selected).map((t, idx) => ({
        ...t,
        orden: idx + 1 // El nuevo orden
      }));

      if (temasAEnviar.length === 0) {
        throw new Error("Debes seleccionar al menos un tema para crear la ruta.");
      }

      const res = await fetch("/api/rutas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materia_nombre: routeData.materia,
          titulo_ruta: routeData.titulo_ruta,
          prompt_original: routeData.prompt_original,
          temas: temasAEnviar
        })
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la ruta.");
      }

      // Cleanup and redirect
      localStorage.removeItem("studia_pending_route");
      router.push("/materias");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem("studia_pending_route");
    router.push("/rutas/crear");
  };

  if (!routeData) {
    return <div className="p-8 text-center text-text-secondary animate-pulse">Cargando mapa...</div>;
  }

  const toggleTema = (index: number) => {
    const newTemas = [...temas];
    newTemas[index].selected = !newTemas[index].selected;
    setTemas(newTemas);
  };

  const moveTema = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newTemas = [...temas];
      const temp = newTemas[index];
      newTemas[index] = newTemas[index - 1];
      newTemas[index - 1] = temp;
      setTemas(newTemas);
    } else if (direction === 'down' && index < temas.length - 1) {
      const newTemas = [...temas];
      const temp = newTemas[index];
      newTemas[index] = newTemas[index + 1];
      newTemas[index + 1] = temp;
      setTemas(newTemas);
    }
  };

  const selectedTemas = temas.filter(t => t.selected);
  const totalMinutes = selectedTemas.reduce((acc: number, t: any) => acc + (t.minutos_estimados || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Cabecera */}
      <section className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-electric-periwinkle/10 text-electric-periwinkle rounded-full text-xs font-bold uppercase tracking-widest mb-2 border border-electric-periwinkle/20">
          <Zap size={14} /> Ruta Generada por IA
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-arctic-slate">
          {routeData.titulo_ruta}
        </h1>
        <p className="text-base sm:text-xl text-arctic-secondary">
          Materia identificada: <span className="text-arctic-slate font-semibold">{routeData.materia}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-arctic-secondary pt-2">
          <span className="flex items-center gap-1.5"><Navigation size={15} /> {selectedTemas.length} paradas seleccionadas</span>
          <span className="flex items-center gap-1.5"><Clock size={15} /> Tiempo est. {hours > 0 ? `${hours}h ` : ''}{minutes}m</span>
        </div>
      </section>

      {/* Trazado de ruta (Visualización Vertical) */}
      <section className="surface-elevated p-6 md:p-10 relative overflow-hidden">
        <h2 className="text-sm uppercase tracking-widest font-bold text-text-secondary mb-10 text-center">Plan de Navegación</h2>
        
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-8 space-y-12">
          {temas.map((tema: any, index: number) => (
            <div key={tema.originalIndex} className={`relative pl-8 md:pl-12 group transition-opacity ${!tema.selected ? 'opacity-40' : ''}`}>
              {/* Nodo */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                tema.selected 
                  ? 'bg-deep-surface border-2 border-electric-periwinkle group-hover:bg-electric-periwinkle' 
                  : 'bg-deep-surface border-2 border-white/20'
              }`}>
                {tema.selected && <div className="w-1.5 h-1.5 bg-electric-periwinkle rounded-full group-hover:bg-deep-ink transition-colors"></div>}
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tema.selected} 
                        onChange={() => toggleTema(index)}
                        className="w-4 h-4 rounded border-white/20 bg-deep-ink text-electric-periwinkle focus:ring-electric-periwinkle focus:ring-offset-deep-surface"
                      />
                      <h3 className={`text-xl font-bold ${tema.selected ? 'text-text-primary' : 'text-text-secondary line-through'}`}>
                        {tema.nombre}
                      </h3>
                    </label>
                    
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      tema.dificultad?.toLowerCase().includes('básic') || tema.dificultad?.toLowerCase().includes('fundamento') ? 'bg-electric-periwinkle/20 text-electric-periwinkle' :
                      tema.dificultad?.toLowerCase().includes('avanzad') ? 'bg-warm-coral/20 text-warm-coral' :
                      'bg-white/10 text-text-secondary'
                    }`}>
                      {tema.dificultad || 'Intermedio'}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock size={12} /> {tema.minutos_estimados} min
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed pl-6">
                    {tema.descripcion}
                  </p>
                </div>

                {/* Controles de orden */}
                <div className="flex md:flex-col gap-2 pl-6 md:pl-0">
                  <button 
                    onClick={() => moveTema(index, 'up')} 
                    disabled={index === 0}
                    className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Mover arriba"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveTema(index, 'down')} 
                    disabled={index === temas.length - 1}
                    className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Mover abajo"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="p-4 bg-warm-coral/10 border border-warm-coral/30 text-warm-coral rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Controles */}
      <section className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-center bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-black/[0.08] shadow-apple-md">
        <button 
          onClick={handleDiscard}
          disabled={saving}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-arctic-secondary hover:text-arctic-slate transition-colors text-center"
        >
          Descartar mapa
        </button>
        <button 
          onClick={handleSaveRoute}
          disabled={saving}
          className="w-full sm:w-auto btn-apple-primary py-3 px-6 text-xs font-semibold apple-tactile shadow-apple-sm flex justify-center items-center gap-2"
        >
          {saving ? "Guardando..." : <><CheckCircle2 size={16} /> <span>Confirmar Ruta</span></>}
        </button>
      </section>

    </div>
  );
}
