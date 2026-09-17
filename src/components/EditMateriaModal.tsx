"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, AlertTriangle, X } from "lucide-react";

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
      <button 
        onClick={() => setIsOpen(true)} 
        className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
      >
        <Settings size={15} />
      </button>
    );
  }

  // Modal de confirmación de eliminación
  if (confirmDelete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="apple-card p-6 rounded-2xl w-full max-w-sm border border-red-500/20 shadow-apple-lg animate-in zoom-in-95">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <div>
              <h3 className="apple-title-3">¿Eliminar materia?</h3>
              <p className="apple-subhead">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <p className="apple-body text-xs text-arctic-secondary mb-5 bg-red-500/[0.04] border border-red-500/15 rounded-xl p-3 leading-relaxed">
            Se eliminarán permanentemente <b className="text-arctic-slate">"{materia.nombre}"</b> y todos sus temas y sesiones asociadas.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={loading}
              className="flex-1 btn-apple-ghost text-xs py-2 apple-tactile"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 btn-apple-destructive text-xs py-2 disabled:opacity-50 apple-tactile"
            >
              {loading ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="apple-card p-6 rounded-2xl w-full max-w-md border border-black/[0.08] shadow-apple-lg animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06] mb-4">
          <h3 className="apple-title-3">Editar Materia</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-arctic-tertiary hover:text-arctic-slate hover:bg-black/[0.05] transition-colors apple-tactile"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-arctic-secondary mb-1">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-xs text-arctic-slate transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-arctic-secondary mb-1">Fecha del parcial</label>
            <input
              type="date"
              value={fechaParcial}
              onChange={e => setFechaParcial(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-frost-base border border-black/[0.08] focus:border-glacier-blue outline-none text-xs text-arctic-slate transition-all [color-scheme:light]"
            />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold text-xs transition-colors disabled:opacity-50 apple-tactile py-1 px-2 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 size={14} strokeWidth={2} /> 
              <span>Eliminar</span>
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-apple-ghost text-xs px-3.5 py-2 apple-tactile"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-apple-primary text-xs py-2 px-5 disabled:opacity-50 apple-tactile shadow-apple-sm"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
