"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown, Filter, Calendar } from "lucide-react";

export default function HistoryFilters({ materias }: { materias: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMateria = searchParams.get("materia") || "";
  const currentRange = searchParams.get("rango") || "all";

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
    <div className="apple-card p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border border-black/[0.07] bg-white/90 shadow-apple-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
        {/* Materia selector */}
        <div className="w-full sm:w-auto flex-1 sm:flex-initial">
          <div className="relative">
            <select
              value={currentMateria}
              onChange={(e) => {
                router.push(`/historial?${createQueryString("materia", e.target.value)}`);
              }}
              className="w-full sm:w-60 appearance-none bg-frost-base border border-black/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium text-arctic-slate hover:border-black/[0.16] focus:outline-none focus:border-glacier-blue transition-all cursor-pointer"
            >
              <option value="">Todas las materias</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
              <Filter size={13} />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
              <ChevronDown size={13} />
            </div>
          </div>
        </div>

        {/* Date range selector */}
        <div className="w-full sm:w-auto flex-1 sm:flex-initial">
          <div className="relative">
            <select
              value={currentRange}
              onChange={(e) => {
                router.push(`/historial?${createQueryString("rango", e.target.value)}`);
              }}
              className="w-full sm:w-48 appearance-none bg-frost-base border border-black/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium text-arctic-slate hover:border-black/[0.16] focus:outline-none focus:border-glacier-blue transition-all cursor-pointer"
            >
              <option value="all">Todo el historial</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
              <Calendar size={13} />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-arctic-secondary">
              <ChevronDown size={13} />
            </div>
          </div>
        </div>
      </div>

      {(currentMateria || currentRange !== "all") && (
        <button
          onClick={() => router.push("/historial")}
          className="text-xs text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile self-end md:self-center"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
