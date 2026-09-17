"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Calendar, BookOpen } from "lucide-react";

export default function CreateMateriaForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fechaParcial, setFechaParcial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nombre,
      fecha_parcial: fechaParcial || null,
    };

    try {
      const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear materia");
      }

      setNombre("");
      setFechaParcial("");
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-apple-secondary text-xs font-semibold py-2 px-3.5 apple-tactile inline-flex items-center gap-1.5"
      >
        <Plus size={14} className="text-glacier-blue" />
        <span>Nueva materia</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="apple-card w-full max-w-md p-6 bg-white/95 border border-black/[0.1] shadow-apple-lg animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-arctic-slate tracking-tight">Nueva Materia</h3>
                  <p className="text-xs text-arctic-secondary">Organiza tus temas y evaluaciones</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-arctic-secondary mb-1.5">
                  Nombre de la materia
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue focus:ring-1 focus:ring-glacier-blue outline-none text-sm text-arctic-slate placeholder:text-arctic-tertiary transition-all"
                  placeholder="Ej. Cálculo Vectorial, Historia del Arte..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-arctic-secondary mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Fecha de parcial o examen (Opcional)</span>
                </label>
                <input
                  type="date"
                  value={fechaParcial}
                  onChange={(e) => setFechaParcial(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-sm text-arctic-slate transition-all [color-scheme:light]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !nombre.trim()}
                  className="btn-apple-primary text-xs py-2 px-5 disabled:opacity-50 apple-tactile"
                >
                  {loading ? "Creando..." : "Crear materia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
