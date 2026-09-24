"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateTemaForm({ materiaId }: { materiaId: string }) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Lectura");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const id = useId();

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
    <form onSubmit={handleSubmit} className="apple-card p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-end gap-3 shadow-apple-sm">
      {error && (
        <p role="alert" className="text-red-700 w-full text-sm font-medium border border-red-500/20 bg-red-500/10 p-2.5 rounded-xl">
          {error}
        </p>
      )}
      <div className="flex-1 w-full min-w-0">
        <label htmlFor={`${id}-nombre`} className="block mb-1.5 text-sm font-medium text-arctic-slate">
          Nombre del tema nuevo
        </label>
        <input
          id={`${id}-nombre`}
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-xl px-3.5 py-2 text-xs bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-arctic-slate placeholder:text-arctic-tertiary transition-all"
          placeholder="Ej. Teorema de Stokes, Guerra Fría..."
        />
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor={`${id}-tipo`} className="block mb-1.5 text-sm font-medium text-arctic-slate">
          Tipo de contenido
        </label>
        <select
          id={`${id}-tipo`}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full sm:w-auto rounded-xl px-3 py-2 text-xs bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-arctic-slate transition-all cursor-pointer"
        >
          {tiposDisponibles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !nombre.trim()}
        className="w-full sm:w-auto btn-apple-primary text-xs py-2 px-4 h-[38px] disabled:opacity-40 apple-tactile shadow-apple-sm flex items-center justify-center gap-1.5 shrink-0"
      >
        <Plus size={14} strokeWidth={2} aria-hidden="true" />
        <span>{loading ? "..." : "Añadir Tema"}</span>
      </button>
    </form>
  );
}
