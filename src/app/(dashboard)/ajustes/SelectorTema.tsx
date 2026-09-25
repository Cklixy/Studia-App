"use client";

import { useEffect, useId, useState } from "react";
import { Monitor, Sun, Moon } from "lucide-react";

type Tema = "sistema" | "claro" | "oscuro";
const OPCIONES: { valor: Tema; etiqueta: string; icono: typeof Sun }[] = [
  { valor: "sistema", etiqueta: "Automático", icono: Monitor },
  { valor: "claro", etiqueta: "Claro", icono: Sun },
  { valor: "oscuro", etiqueta: "Oscuro", icono: Moon },
];

// Tema de la app: «Automático» sigue al sistema (prefers-color-scheme). Se guarda en este dispositivo
// y el script de app/layout.tsx lo aplica antes de pintar.
export default function SelectorTema() {
  const id = useId();
  const [tema, setTema] = useState<Tema>("sistema");

  useEffect(() => {
    try {
      const t = localStorage.getItem("studia-tema");
      if (t === "claro" || t === "oscuro") setTema(t);
    } catch {}
  }, []);

  const elegir = (t: Tema) => {
    setTema(t);
    try {
      if (t === "sistema") localStorage.removeItem("studia-tema");
      else localStorage.setItem("studia-tema", t);
    } catch {}
    if (t === "sistema") delete document.documentElement.dataset.tema;
    else document.documentElement.dataset.tema = t;
  };

  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-2">Tema</legend>
      <div className="segmentado w-full">
        {OPCIONES.map(({ valor, etiqueta, icono: Icono }) => (
          <label
            key={valor}
            className={`flex-1 flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-acento ${
              tema === valor ? "bg-superficie text-tinta shadow-1 ring-1 ring-linea-fuerte" : "text-tinta-2"
            }`}
          >
            <input type="radio" name={`${id}-tema`} value={valor} checked={tema === valor} onChange={() => elegir(valor)} className="sr-only" />
            <Icono aria-hidden="true" size={16} />
            {etiqueta}
          </label>
        ))}
      </div>
      <p className="text-xs text-tinta-2 mt-2">Automático usa el modo de tu celular o computador. El oscuro cansa menos de noche.</p>
    </fieldset>
  );
}
