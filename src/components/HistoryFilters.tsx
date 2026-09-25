"use client";

import { useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface MateriaItem {
  id: string;
  nombre: string;
}

// Filtros del historial: dos selects con etiqueta visible y un «Quitar filtros» con área táctil completa.
export default function HistoryFilters({ materias }: { materias: MateriaItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();

  const materia = searchParams.get("materia") || "";
  const rango = searchParams.get("rango") || "all";
  const hayFiltros = materia !== "" || rango !== "all";

  const cambiar = (nombre: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor && valor !== "all") params.set(nombre, valor);
    else params.delete(nombre);
    const q = params.toString();
    router.push(q ? `/historial?${q}` : "/historial");
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-m`} className="text-xs font-semibold text-tinta-2">Materia</label>
        <select id={`${id}-m`} value={materia} onChange={(e) => cambiar("materia", e.target.value)} className="campo min-h-11 py-2 text-sm">
          <option value="">Todas</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-r`} className="text-xs font-semibold text-tinta-2">Periodo</label>
        <select id={`${id}-r`} value={rango} onChange={(e) => cambiar("rango", e.target.value)} className="campo min-h-11 py-2 text-sm">
          <option value="all">Todo</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>
      {hayFiltros && (
        <button type="button" onClick={() => router.push("/historial")} className="btn-fantasma col-span-2 justify-self-start text-sm">
          <X aria-hidden="true" size={16} /> Quitar filtros
        </button>
      )}
    </div>
  );
}
