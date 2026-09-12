"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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
        throw new Error(data.error || "Error al crear territorio");
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

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-electric-periwinkle hover:text-white transition-colors"
      >
        <Plus size={16} /> Nueva materia
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-elevated p-6 mt-4 relative animate-in fade-in zoom-in-95 duration-200 border-l-4 border-l-electric-periwinkle">
      <h3 className="text-sm uppercase tracking-widest font-bold text-text-secondary mb-4">Añadir al mapa</h3>
      {error && <p className="text-warm-coral mb-4 text-sm font-medium border border-warm-coral/20 bg-warm-coral/5 p-2 rounded">{error}</p>}
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block mb-2 text-xs uppercase tracking-widest text-text-secondary font-bold">Nombre</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none transition-colors"
            placeholder="Ej. Cálculo Vectorial"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block mb-2 text-xs uppercase tracking-widest text-text-secondary font-bold">Fecha del Parcial (Opcional)</label>
          <input
            type="date"
            value={fechaParcial}
            onChange={(e) => setFechaParcial(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none transition-colors [color-scheme:dark]"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-text-secondary hover:text-white transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !nombre}
            className="bg-electric-periwinkle text-deep-ink font-bold rounded-lg px-6 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? "..." : "Crear"}
          </button>
        </div>
      </div>
    </form>
  );
}
