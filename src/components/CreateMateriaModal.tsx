"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, BookOpen } from "lucide-react";
import Dialogo from "@/components/ui/Dialogo";

interface CreateMateriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMateriaModal({ isOpen, onClose }: CreateMateriaModalProps) {
  const router = useRouter();
  const id = useId();
  const [nombre, setNombre] = useState("");
  const [fechaParcial, setFechaParcial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, fecha_parcial: fechaParcial || null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "No pudimos crear la materia. Inténtalo de nuevo.");
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
    <Dialogo
      abierto={isOpen}
      onCerrar={onClose}
      titulo="Nueva materia"
      descripcion="Organiza tus temas y parciales"
      icono={
        <div className="w-9 h-9 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center">
          <BookOpen size={17} strokeWidth={2} />
        </div>
      }
    >
      {error && (
        <div role="alert" className="mb-4 p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`${id}-nombre`} className="block text-sm font-medium text-arctic-slate mb-1.5">
            Nombre de la materia <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-nombre`}
            type="text"
            required
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate transition-all"
            placeholder="Ej. Cálculo Vectorial, Historia del Arte…"
          />
        </div>

        <div>
          <label htmlFor={`${id}-fecha`} className="block text-sm font-medium text-arctic-slate mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} strokeWidth={2} aria-hidden="true" />
            <span>Fecha del parcial o examen (opcional)</span>
          </label>
          <input
            id={`${id}-fecha`}
            type="date"
            value={fechaParcial}
            onChange={(e) => setFechaParcial(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate transition-all [color-scheme:light]"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-apple-ghost text-sm px-4 min-h-11 apple-tactile">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !nombre.trim()}
            className="btn-apple-primary text-sm min-h-11 px-5 disabled:opacity-50 apple-tactile"
          >
            {loading ? "Creando…" : "Crear materia"}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
