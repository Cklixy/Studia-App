"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Navigation, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fundido, resorte } from "@/lib/movimiento";

export default function RutaPreviewPage() {
  const router = useRouter();
  const reducido = useReducedMotion();
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
    // Esqueleto con la forma de la ruta (título, datos y paradas) en lugar de un texto parpadeante
    return (
      <div className="max-w-4xl mx-auto space-y-8" aria-busy="true">
        <span className="sr-only">Cargando la ruta…</span>
        <div className="flex flex-col items-center gap-3" aria-hidden="true">
          <div className="h-6 w-40 rounded-full apple-shimmer" />
          <div className="h-9 w-3/4 max-w-lg rounded-xl apple-shimmer" />
          <div className="h-4 w-56 rounded-lg apple-shimmer" />
        </div>
        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="apple-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full apple-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded-lg apple-shimmer" />
                <div className="h-3 w-3/4 rounded-lg apple-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
    <div className="max-w-4xl mx-auto space-y-10 pb-20">

      {/* Cabecera */}
      <section className="space-y-4 text-center">
        <div className="tracking-wide inline-flex items-center gap-2 px-3 py-1 bg-glacier-blue/10 text-glacier-blue rounded-full text-xs font-semibold mb-2 border border-glacier-blue/20">
          <Zap size={14} aria-hidden="true" /> Ruta generada por IA
        </div>
        <h1 className="apple-large-title text-arctic-slate">
          {routeData.titulo_ruta}
        </h1>
        <p className="text-sm sm:text-base text-arctic-secondary">
          Materia identificada: <span className="text-arctic-slate font-semibold">{routeData.materia}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-arctic-secondary pt-2">
          <span className="flex items-center gap-1.5"><Navigation size={15} aria-hidden="true" /> {selectedTemas.length} {selectedTemas.length === 1 ? "tema seleccionado" : "temas seleccionados"}</span>
          <span className="flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> Tiempo estimado: {hours > 0 ? `${hours} h ` : ''}{minutes} min</span>
        </div>
      </section>

      {/* Trazado de ruta (Visualización Vertical) */}
      <section className="apple-card p-6 md:p-10 relative overflow-hidden">
        <h2 className="apple-title-3 text-arctic-slate mb-1">Temas de la ruta</h2>
        <p className="text-sm text-arctic-secondary mb-8">Quita los que no necesites y ordénalos a tu gusto antes de guardar.</p>

        <div className="relative border-l-2 border-black/[0.1] ml-4 md:ml-8 space-y-12">
          {temas.map((tema: any, index: number) => (
            <motion.div
              key={tema.originalIndex}
              layout={!reducido}
              transition={reducido ? fundido : resorte}
              className={`relative pl-8 md:pl-12 group transition-opacity ${!tema.selected ? 'opacity-40' : ''}`}
            >
              {/* Nodo */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                tema.selected
                  ? 'bg-white border-2 border-glacier-blue group-hover:bg-glacier-blue'
                  : 'bg-white border-2 border-arctic-borde'
              }`}>
                {tema.selected && <div className="w-1.5 h-1.5 bg-glacier-blue rounded-full group-hover:bg-frost-base transition-colors"></div>}
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tema.selected}
                        onChange={() => toggleTema(index)}
                        className="w-4 h-4 rounded border-arctic-borde bg-white text-glacier-blue focus:ring-glacier-blue focus:ring-offset-white"
                      />
                      <h3 className={`apple-title-3 ${tema.selected ? 'text-arctic-slate' : 'text-arctic-secondary line-through'}`}>
                        {tema.nombre}
                      </h3>
                    </label>

                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      tema.dificultad?.toLowerCase().includes('básic') || tema.dificultad?.toLowerCase().includes('fundamento') ? 'bg-glacier-blue/10 text-glacier-blue' :
                      tema.dificultad?.toLowerCase().includes('avanzad') ? 'bg-cool-berry/10 text-cool-berry' :
                      'bg-black/[0.05] text-arctic-secondary'
                    }`}>
                      {tema.dificultad || 'Intermedio'}
                    </span>
                    <span className="text-xs text-arctic-secondary flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" /> {tema.minutos_estimados} min
                    </span>
                  </div>
                  <p className="text-arctic-secondary text-sm leading-relaxed pl-6">
                    {tema.descripcion}
                  </p>
                </div>

                {/* Controles de orden */}
                <div className="flex md:flex-col gap-2 pl-6 md:pl-0">
                  <button
                    type="button"
                    onClick={() => moveTema(index, 'up')}
                    disabled={index === 0}
                    aria-label={`Mover «${tema.nombre}» arriba`}
                    className="w-11 h-11 flex items-center justify-center text-arctic-secondary hover:text-arctic-slate hover:bg-black/[0.05] rounded-full disabled:opacity-30 disabled:hover:bg-transparent apple-tactile"
                    title="Mover arriba"
                  >
                    <ChevronUp size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTema(index, 'down')}
                    disabled={index === temas.length - 1}
                    aria-label={`Mover «${tema.nombre}» abajo`}
                    className="w-11 h-11 flex items-center justify-center text-arctic-secondary hover:text-arctic-slate hover:bg-black/[0.05] rounded-full disabled:opacity-30 disabled:hover:bg-transparent apple-tactile"
                    title="Mover abajo"
                  >
                    <ChevronDown size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm text-center">
          {error}
        </div>
      )}

      {/* Controles */}
      <section className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-center apple-glass p-4 rounded-2xl shadow-apple-md">
        <button
          onClick={handleDiscard}
          disabled={saving}
          className="w-full sm:w-auto btn-apple-ghost text-sm min-h-11 apple-tactile"
        >
          Descartar ruta
        </button>
        <button
          onClick={handleSaveRoute}
          disabled={saving}
          className="w-full sm:w-auto btn-apple-primary text-sm min-h-12 px-6 apple-tactile"
        >
          {saving ? "Guardando…" : <><CheckCircle2 size={16} aria-hidden="true" /> <span>Guardar ruta</span></>}
        </button>
      </section>

    </div>
  );
}
