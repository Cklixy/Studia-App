"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import EvaluacionesPanel from "./EvaluacionesPanel";

export default function EvaluacionesGlobal({ materias }: { materias: any[] }) {
  const [selectedMateria, setSelectedMateria] = useState<string>(materias.length > 0 ? materias[0].id : "");

  if (materias.length === 0) {
    return (
      <div className="surface-panel p-10 text-center text-text-secondary">
        Aún no tienes materias registradas para calcular calificaciones.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Selector de Materia con el diseño Premium */}
      <div className="surface-panel p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-auto">
          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Selecciona una Materia</label>
          <div className="relative">
            <select
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
              className="w-full md:w-72 appearance-none bg-deep-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover:border-white/20 focus:outline-none focus:border-electric-periwinkle focus:ring-1 focus:ring-electric-periwinkle transition-colors cursor-pointer"
            >
              {materias.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {selectedMateria && (
        <EvaluacionesPanel materiaId={selectedMateria} />
      )}
    </div>
  );
}
