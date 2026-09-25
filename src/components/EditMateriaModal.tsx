"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, AlertTriangle } from "lucide-react";
import Dialogo from "@/components/ui/Dialogo";
import { avisar } from "@/lib/avisos";

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
      avisar("Cambios guardados");
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
      avisar(`«${materia.nombre}» eliminada`);
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
        className="w-11 h-11 shrink-0 rounded-full border border-linea-fuerte bg-superficie hover:bg-hundido flex items-center justify-center text-tinta-2 hover:text-tinta transition-colors tactil"
      >
        <Settings size={17} aria-hidden="true" />
      </button>

      <Dialogo
        abierto={isOpen && !confirmDelete}
        onCerrar={() => { if (!confirmDelete) setIsOpen(false); }}
        titulo="Editar materia"
      >
        {error && (
          <div role="alert" className="mb-4 rounded-xl bg-error-suave p-3 text-sm font-semibold text-error">
            {error}
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor={`${id}-nombre`} className="block text-sm font-semibold text-tinta mb-1.5">Nombre</label>
            <input
              id={`${id}-nombre`}
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="campo"
            />
          </div>
          <div>
            <label htmlFor={`${id}-fecha`} className="block text-sm font-semibold text-tinta mb-1.5">Fecha del parcial</label>
            <input
              id={`${id}-fecha`}
              type="date"
              value={fechaParcial}
              onChange={(e) => setFechaParcial(e.target.value)}
              className="campo"
            />
          </div>
          <div className="flex justify-between items-center gap-2 pt-3 border-t border-linea">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="flex items-center gap-1.5 text-error hover:text-error font-semibold text-sm transition-colors disabled:opacity-50 tactil min-h-11 px-2 rounded-lg hover:bg-error/10"
            >
              <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
              <span>Eliminar materia</span>
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsOpen(false)} className="btn-fantasma">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-primario">
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
          <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
        }
      >
        {error && (
          <div role="alert" className="mb-4 rounded-xl bg-error-suave p-3 text-sm font-semibold text-error">
            {error}
          </div>
        )}
        {/* Las sesiones se conservan en el historial (sesiones.materia_id ON DELETE SET NULL) */}
        <p className="mb-5 text-tinta">
          Se eliminarán <b>&ldquo;{materia.nombre}&rdquo;</b>, sus temas, su ruta y sus notas. Tus sesiones de estudio se
          conservarán en el historial.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            disabled={loading}
            data-autofocus
            className="flex-1 btn-secundario"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 btn-peligro"
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </Dialogo>
    </>
  );
}
