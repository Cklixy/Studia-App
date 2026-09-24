"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, AlertTriangle } from "lucide-react";
import Dialogo from "@/components/ui/Dialogo";

export default function EditMateriaModal({ materia }: { materia: any }) {
  const router = useRouter();
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [nombre, setNombre] = useState(materia.nombre);
  const [fechaParcial, setFechaParcial] = useState(materia.fecha_parcial ? materia.fecha_parcial.split("T")[0] : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/materias/${materia.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, fecha_parcial: fechaParcial || null }),
      });
      if (!res.ok) throw new Error();
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("No pudimos guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/materias/${materia.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/materias");
      router.refresh();
    } catch {
      setError("No pudimos eliminar la materia. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* El botón siempre existe, para que el foco vuelva a él al cerrar el diálogo */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Editar materia ${materia.nombre}`}
        aria-haspopup="dialog"
        className="w-11 h-11 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile"
      >
        <Settings size={17} aria-hidden="true" />
      </button>

      <Dialogo
        abierto={isOpen && !confirmDelete}
        onCerrar={() => { if (!confirmDelete) setIsOpen(false); }}
        titulo="Editar materia"
      >
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor={`${id}-nombre`} className="block text-sm font-medium text-arctic-slate mb-1.5">Nombre</label>
            <input
              id={`${id}-nombre`}
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate transition-all"
            />
          </div>
          <div>
            <label htmlFor={`${id}-fecha`} className="block text-sm font-medium text-arctic-slate mb-1.5">Fecha del parcial</label>
            <input
              id={`${id}-fecha`}
              type="date"
              value={fechaParcial}
              onChange={(e) => setFechaParcial(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 bg-white border border-arctic-borde focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none text-base text-arctic-slate transition-all [color-scheme:light]"
            />
          </div>
          <div className="flex justify-between items-center gap-2 pt-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="flex items-center gap-1.5 text-red-700 hover:text-red-800 font-semibold text-sm transition-colors disabled:opacity-50 apple-tactile min-h-11 px-2 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
              <span>Eliminar</span>
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsOpen(false)} className="btn-apple-ghost text-sm px-3.5 min-h-11 apple-tactile">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-apple-primary text-sm min-h-11 px-5 disabled:opacity-50 apple-tactile shadow-apple-sm">
                {loading ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </Dialogo>

      {/* Confirmación de borrado */}
      <Dialogo
        abierto={isOpen && confirmDelete}
        onCerrar={() => setConfirmDelete(false)}
        titulo="¿Eliminar materia?"
        descripcion="Esta acción no se puede deshacer."
        tono="peligro"
        anchoMaximo="sm"
        icono={
          <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-700 flex items-center justify-center">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
        }
      >
        {error && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-cool-berry/10 border border-cool-berry/20 text-cool-berry text-sm">
            {error}
          </div>
        )}
        {/* Las sesiones se conservan en el historial (sesiones.materia_id ON DELETE SET NULL) */}
        <p className="text-sm text-arctic-slate mb-5 bg-red-500/[0.04] border border-red-500/15 rounded-xl p-3 leading-relaxed">
          Se eliminarán <b>&ldquo;{materia.nombre}&rdquo;</b>, sus temas, su ruta y sus notas. Tus sesiones de estudio se
          conservarán en el historial.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            disabled={loading}
            data-autofocus
            className="flex-1 btn-apple-ghost text-sm min-h-11 apple-tactile"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 btn-apple-destructive text-sm min-h-11 disabled:opacity-50 apple-tactile"
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </Dialogo>
    </>
  );
}
