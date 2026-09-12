"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTemaForm({ materiaId }: { materiaId: string }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Lectura");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tiposDisponibles = ["Lectura", "Video", "Ejercicio", "Resumen", "Otro"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      nombre,
      tipo_contenido: tipo,
    };

    try {
      const res = await fetch(`/api/materias/${materiaId}/temas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear tema");
      }

      setNombre("");
      setTipo("Lectura");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-elevated p-6 mb-8 flex items-end gap-4 flex-wrap border-l-4 border-l-electric-periwinkle animate-in fade-in zoom-in-95 duration-200">
      {error && <p className="text-warm-coral w-full text-sm font-medium border border-warm-coral/20 bg-warm-coral/5 p-2 rounded">{error}</p>}
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2 text-xs uppercase tracking-widest text-text-secondary font-bold">Nombre del tema</label>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none transition-colors"
          placeholder="Ej. Derivadas parciales"
        />
      </div>
      <div>
        <label className="block mb-2 text-xs uppercase tracking-widest text-text-secondary font-bold">Tipo de contenido</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none transition-colors cursor-pointer"
        >
          {tiposDisponibles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-action px-6 py-2 h-[42px] disabled:opacity-50"
      >
        {loading ? "..." : "Agregar Tema"}
      </button>
    </form>
  );
}
