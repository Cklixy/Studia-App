"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";

const EvaluacionesPanel = dynamic(() => import("./EvaluacionesPanel"), {
  loading: () => (
    <div className="tarjeta p-6 h-48 rounded-2xl bg-superficie border border-linea shadow-1 animate-pulse" />
  ),
});

export default function EvaluacionesGlobal({ materias }: { materias: any[] }) {
  const [selectedMateria, setSelectedMateria] = useState<string>(materias.length > 0 ? materias[0].id : "");

  if (materias.length === 0) {
    return (
      <div className="tarjeta p-10 text-center text-tinta-2 bg-superficie">
        <BookOpen size={28} className="mx-auto mb-2 text-tinta-3" />
        <p className="text-sm font-medium text-tinta">Aún no tienes materias registradas para calcular calificaciones.</p>
        <p className="text-xs text-tinta-2 mt-1">Crea una materia primero desde la sección principal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Apple-style segmented subject selector en Cristal Blanco */}
      <div className="tarjeta p-2 flex items-center gap-1.5 overflow-x-auto bg-superficie border border-linea shadow-1">
        {materias.map((m) => {
          const isSelected = selectedMateria === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMateria(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all tactil ${
                isSelected
                  ? "bg-acento text-sobre-acento shadow-1"
                  : "text-tinta-2 hover:text-tinta hover:bg-hundido"
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
