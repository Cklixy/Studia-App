"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown, Filter, Calendar, X } from "lucide-react";

interface MateriaItem {
  id: string;
  nombre: string;
}

export default function HistoryFilters({ materias }: { materias: MateriaItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMateria = searchParams.get("materia") || "";
  const currentRange = searchParams.get("rango") || "all";
  const hasActiveFilters = currentMateria !== "" || currentRange !== "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      {/* Controles de selección agrupados */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
        {/* Selector de Materia */}
        <div className="relative flex-1 sm:max-w-xs">
          <select
            value={currentMateria}
            onChange={(e) => {
              router.push(`/historial?${createQueryString("materia", e.target.value)}`);
            }}
            aria-label="Filtrar por materia"
            className="w-full appearance-none bg-white/80 hover:bg-white border border-black/[0.08] hover:border-black/[0.14] rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-arctic-slate shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:border-glacier-blue/50 focus:ring-2 focus:ring-glacier-blue/15 transition-all cursor-pointer"
          >
            <option value="">Todas las materias</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
            <Filter size={13} strokeWidth={2} />
          </div>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
            <ChevronDown size={13} strokeWidth={2} />
          </div>
        </div>

        {/* Selector de Rango Temporal */}
        <div className="relative flex-1 sm:max-w-[200px]">
          <select
            value={currentRange}
            onChange={(e) => {
              router.push(`/historial?${createQueryString("rango", e.target.value)}`);
            }}
            aria-label="Filtrar por rango temporal"
            className="w-full appearance-none bg-white/80 hover:bg-white border border-black/[0.08] hover:border-black/[0.14] rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-arctic-slate shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none focus:border-glacier-blue/50 focus:ring-2 focus:ring-glacier-blue/15 transition-all cursor-pointer"
          >
            <option value="all">Todo el historial</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
            <Calendar size={13} strokeWidth={2} />
          </div>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
            <ChevronDown size={13} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Botón de limpiar filtros discretos */}
      {hasActiveFilters && (
        <button
          onClick={() => router.push("/historial")}
          className="text-xs text-arctic-secondary hover:text-arctic-slate font-medium px-2.5 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors self-start sm:self-center inline-flex items-center gap-1.5 apple-tactile"
        >
          <X size={12} strokeWidth={2.2} />
          <span>Limpiar filtros</span>
        </button>
      )}
    </div>
  );
}
