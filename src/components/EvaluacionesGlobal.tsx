"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";

const EvaluacionesPanel = dynamic(() => import("./EvaluacionesPanel"), {
  loading: () => <div aria-hidden="true" className="esqueleto h-48" />,
});

// Notas por materia en Parciales: selector con radios (un toque) y el panel de notas de la elegida.
export default function EvaluacionesGlobal({ materias }: { materias: { id: string; nombre: string }[] }) {
  const id = useId();
  const [elegida, setElegida] = useState<string>(materias[0]?.id ?? "");
  if (materias.length === 0) return null;

  return (
    <section aria-labelledby={`${id}-t`} className="flex flex-col gap-4">
      <h2 id={`${id}-t`} className="titulo-2">Notas</h2>
      <div role="radiogroup" aria-labelledby={`${id}-t`} className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {materias.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={elegida === m.id}
            onClick={() => setElegida(m.id)}
            className={`tactil shrink-0 min-h-11 rounded-full border px-4 text-sm font-semibold whitespace-nowrap ${
              elegida === m.id ? "border-acento bg-acento-suave text-acento" : "border-linea-fuerte bg-superficie text-tinta"
            }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>
      {elegida && <EvaluacionesPanel key={elegida} materiaId={elegida} conTitulo={false} />}
    </section>
  );
}
