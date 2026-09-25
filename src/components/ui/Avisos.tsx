"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { EVENTO_AVISO, type Aviso } from "@/lib/avisos";

const ICONOS = { exito: CheckCircle2, error: AlertCircle, info: Info };
const DURACION_MS = 4000;

/** Región de avisos: encima del dock, en la zona del pulgar, anunciada por lectores de pantalla. */
export default function Avisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    let siguiente = 1;
    const alAvisar = (e: Event) => {
      const { texto, tono } = (e as CustomEvent<Omit<Aviso, "id">>).detail;
      const id = siguiente++;
      setAvisos((a) => [...a.slice(-2), { id, texto, tono }]);
      window.setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), DURACION_MS);
    };
    window.addEventListener(EVENTO_AVISO, alAvisar);
    return () => window.removeEventListener(EVENTO_AVISO, alAvisar);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4 pointer-events-none"
      style={{ bottom: "calc(max(1rem, env(safe-area-inset-bottom, 0px) + 0.5rem) + 5.5rem)" }}
    >
      {avisos.map(({ id, texto, tono }) => {
        const Icono = ICONOS[tono];
        return (
          <div key={id} className="aparecer pointer-events-auto flex items-center gap-2.5 max-w-sm w-full sm:w-auto px-4 py-3 rounded-2xl bg-tinta text-fondo shadow-3 text-sm font-semibold">
            <Icono aria-hidden="true" size={18} className={`shrink-0 ${tono === "error" ? "text-error-suave" : "text-fondo"}`} />
            <span>{texto}</span>
          </div>
        );
      })}
    </div>
  );
}
