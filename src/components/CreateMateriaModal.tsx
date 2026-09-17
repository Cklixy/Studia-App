"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, BookOpen } from "lucide-react";

interface CreateMateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMateriaModal({ isOpen, onClose }: CreateMateriaModalProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [fechaParcial, setFechaParcial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="apple-card w-full max-w-md p-6 border border-black/[0.08] shadow-apple-lg animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
              <BookOpen size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="apple-title-3">Nueva Materia</h3>
              <p className="apple-subhead">Organiza tus temas y evaluaciones</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-arctic-tertiary hover:text-arctic-slate hover:bg-black/[0.05] transition-colors apple-tactile"
          >
            <X size={16} strokeWidth={2} />
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
              Nombre de la materia *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-sm text-arctic-slate transition-all"
              placeholder="Ej. Cálculo Vectorial, Historia del Arte..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-arctic-secondary mb-1.5 flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={2} />
              <span>Fecha de parcial o examen (Opcional)</span>
            </label>
            <input
              type="date"
              value={fechaParcial}
              onChange={(e) => setFechaParcial(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-sm text-arctic-slate transition-all [color-scheme:light]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-apple-ghost text-xs px-4 py-2 apple-tactile"
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
  );
}
