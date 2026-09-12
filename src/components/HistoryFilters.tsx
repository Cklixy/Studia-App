"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown } from "lucide-react";

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
    <div className="surface-panel p-6 flex flex-col md:flex-row gap-6 items-center">
      <div className="w-full md:w-auto">
        <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Materia</label>
        <div className="relative">
          <select
            value={currentMateria}
            onChange={(e) => {
              router.push(`/historial?${createQueryString("materia", e.target.value)}`);
            }}
            className="w-full md:w-56 appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
          >
            <option value="">Todas las materias</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto">
        <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Rango de fechas</label>
        <div className="relative">
          <select
            value={currentRange}
            onChange={(e) => {
              router.push(`/historial?${createQueryString("rango", e.target.value)}`);
            }}
            className="w-full md:w-56 appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
          >
            <option value="all">Siempre</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
