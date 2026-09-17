"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import EvaluacionesPanel from "./EvaluacionesPanel";

export default function EvaluacionesGlobal({ materias }: { materias: any[] }) {
  const [selectedMateria, setSelectedMateria] = useState<string>(materias.length > 0 ? materias[0].id : "");

  if (materias.length === 0) {
    return (
      <div className="apple-card p-10 text-center text-arctic-secondary bg-white/90">
        <BookOpen size={28} className="mx-auto mb-2 text-arctic-tertiary" />
        <p className="text-sm font-medium text-arctic-slate">Aún no tienes materias registradas para calcular calificaciones.</p>
        <p className="text-xs text-arctic-secondary mt-1">Crea una materia primero desde la sección principal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Apple-style segmented subject selector en Cristal Blanco */}
      <div className="apple-card p-2 flex items-center gap-1.5 overflow-x-auto bg-white/90 border border-black/[0.07] shadow-apple-sm">
        {materias.map((m) => {
          const isSelected = selectedMateria === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMateria(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all apple-tactile ${
                isSelected
                  ? "bg-glacier-blue text-white shadow-apple-sm"
                  : "text-arctic-secondary hover:text-arctic-slate hover:bg-black/[0.03]"
              }`}
            >
              {m.nombre}
            </button>
          );
        })}
      </div>

      {selectedMateria && (
        <EvaluacionesPanel materiaId={selectedMateria} />
      )}
    </div>
  );
}
