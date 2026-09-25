"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Sparkles, ChevronUp, ChevronDown, Loader2 } from "lucide-react";

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
    return <div aria-busy="true" className="esqueleto h-64"><span className="sr-only">Cargando el plan…</span></div>;
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

  // Vista previa del plan con IA (rediseño 4.2): revisar, quitar y reordenar temas antes de guardar.
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <header>
        <p className="chip chip-acento"><Sparkles aria-hidden="true" size={14} /> Propuesta de la IA: revísala</p>
        <h1 className="titulo-1 mt-3">{routeData.titulo_ruta}</h1>
        <p className="subtitulo mt-1.5">
          Materia: <strong className="text-tinta">{routeData.materia}</strong> · {selectedTemas.length} {selectedTemas.length === 1 ? "tema" : "temas"} · {hours > 0 ? `${hours} h ` : ""}{minutes} min en total
        </p>
        <p className="text-sm text-tinta-2 mt-2">Desmarca lo que no entra y ordena con las flechas. La IA puede equivocarse: compara con el programa de tu materia.</p>
      </header>

      <ol className="flex flex-col gap-2">
        {temas.map((tema: any, index: number) => (
          <li key={tema.originalIndex} className={`tarjeta flex gap-2 p-2 pr-1.5 ${tema.selected ? "" : "bg-fondo border-dashed"}`}>
            <label className="flex min-w-0 flex-1 cursor-pointer gap-3 p-2">
              <input
                type="checkbox"
                checked={tema.selected}
                onChange={() => toggleTema(index)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--acento))]"
              />
              <span className="min-w-0">
                <span className={`block font-semibold ${tema.selected ? "text-tinta" : "text-tinta-2 line-through"}`}>
                  <span className="text-tinta-3 font-normal tabular-nums">{index + 1}. </span>{tema.nombre}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-tinta-2">
                  <span className="inline-flex items-center gap-1"><Clock aria-hidden="true" size={12} />{tema.minutos_estimados} min</span>
                  {tema.dificultad && <span>{tema.dificultad}</span>}
                </span>
                {tema.descripcion && <span className="mt-1 block text-sm text-tinta-2">{tema.descripcion}</span>}
              </span>
            </label>
            <div className="flex flex-col">
              <button type="button" onClick={() => moveTema(index, "up")} disabled={index === 0} aria-label={`Mover «${tema.nombre}» arriba`} className="w-11 h-11 flex items-center justify-center rounded-full text-tinta-2 hover:bg-hundido disabled:opacity-30">
                <ChevronUp aria-hidden="true" size={20} />
              </button>
              <button type="button" onClick={() => moveTema(index, "down")} disabled={index === temas.length - 1} aria-label={`Mover «${tema.nombre}» abajo`} className="w-11 h-11 flex items-center justify-center rounded-full text-tinta-2 hover:bg-hundido disabled:opacity-30">
                <ChevronDown aria-hidden="true" size={20} />
              </button>
            </div>
          </li>
        ))}
      </ol>

      {error && <p role="alert" className="rounded-xl bg-error-suave px-4 py-3 text-sm font-semibold text-error">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row-reverse sm:justify-start">
        <button type="button" onClick={handleSaveRoute} disabled={saving || selectedTemas.length === 0} className="btn-primario text-base min-h-12">
          {saving ? <Loader2 aria-hidden="true" size={18} className="animate-spin" /> : <CheckCircle2 aria-hidden="true" size={18} />}
          {saving ? "Guardando…" : `Guardar plan con ${selectedTemas.length} ${selectedTemas.length === 1 ? "tema" : "temas"}`}
        </button>
        <button type="button" onClick={handleDiscard} disabled={saving} className="btn-fantasma">Descartar y empezar de nuevo</button>
      </div>
    </div>
  );
}
