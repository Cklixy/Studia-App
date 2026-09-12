"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash, AlertTriangle } from "lucide-react";

export default function EditMateriaModal({ materia }: { materia: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [nombre, setNombre] = useState(materia.nombre);
  const [fechaParcial, setFechaParcial] = useState(materia.fecha_parcial ? materia.fecha_parcial.split('T')[0] : "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/materias/${materia.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, fecha_parcial: fechaParcial || null }),
      });
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/materias/${materia.id}`, { method: "DELETE" });
      router.push("/materias");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="p-2 text-text-secondary hover:text-white transition">
        <Settings size={20} />
      </button>
    );
  }

  // Modal de confirmación de eliminación
  if (confirmDelete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="surface-elevated p-6 rounded-xl w-full max-w-sm animate-in fade-in zoom-in-95 border border-warm-coral/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-warm-coral/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-warm-coral" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">¿Eliminar materia?</h3>
              <p className="text-xs text-text-secondary">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-6 bg-warm-coral/5 border border-warm-coral/10 rounded-lg p-3">
            Se eliminarán permanentemente <b className="text-text-primary">"{materia.nombre}"</b> y todos sus temas y sesiones asociadas.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/5 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-warm-coral text-deep-ink font-bold text-sm hover:bg-red-400 transition disabled:opacity-50"
            >
              {loading ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="surface-elevated p-6 rounded-xl w-full max-w-md animate-in fade-in zoom-in-95">
        <h3 className="font-display font-bold text-xl mb-4">Editar Materia</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-1">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-1">Fecha del parcial</label>
            <input
              type="date"
              value={fechaParcial}
              onChange={e => setFechaParcial(e.target.value)}
              className="w-full rounded-lg px-4 py-2 bg-deep-ink border border-white/10 focus:border-electric-periwinkle outline-none [color-scheme:dark]"
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="flex items-center gap-2 text-warm-coral hover:text-red-400 font-bold text-sm transition disabled:opacity-50"
            >
              <Trash size={16} /> Eliminar
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-text-secondary hover:text-white transition text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-action px-6 py-2 disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


