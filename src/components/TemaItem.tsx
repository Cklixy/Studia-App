"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, Play, Clock } from "lucide-react";
import { avisar } from "@/lib/avisos";

const ThemeChat = dynamic(() => import("./ThemeChat"), { ssr: false });

// Fila de tema (un solo componente para temas manuales y de ruta IA, principio 9):
// marcar hecho (optimista), abrir el tutor y estudiar este tema.
export default function TemaItem({
  tema,
  materiaNombre,
  materiaId,
  numero,
  actual = false,
}: {
  tema: any;
  materiaNombre: string;
  materiaId: string;
  numero?: number;
  actual?: boolean;
}) {
  const router = useRouter();
  const [hecho, setHecho] = useState(tema.estado === "completado");
  const [guardando, setGuardando] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);

  const alternar = async () => {
    const nuevo = !hecho;
    setHecho(nuevo); // UI optimista: el cambio se ve al instante
    setGuardando(true);
    try {
      const res = await fetch(`/api/temas/${tema.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nuevo }),
      });
      if (!res.ok) throw new Error();
      if (nuevo) avisar(`«${tema.nombre}» completado`);
      router.refresh();
    } catch {
      setHecho(!nuevo);
      avisar("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.", "error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className={`tarjeta flex items-center gap-2 p-2 pr-2 sm:pr-3 ${actual ? "border-acento/50" : ""}`}>
      <button
        type="button"
        onClick={alternar}
        disabled={guardando}
        aria-pressed={hecho}
        aria-label={`Marcar «${tema.nombre}» como completado`}
        className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full hover:bg-hundido"
      >
        <span
          aria-hidden="true"
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-rapida ${
            hecho ? "bg-exito text-sobre-acento" : "border-2 border-linea-fuerte"
          }`}
        >
          {hecho && <Check size={15} strokeWidth={3} />}
        </span>
      </button>

      <div className="min-w-0 flex-1 py-1">
        <p className={`font-semibold leading-snug ${hecho ? "line-through text-tinta-2" : "text-tinta"}`}>
          {numero !== undefined && <span className="text-tinta-3 font-normal tabular-nums">{numero}. </span>}
          {tema.nombre}
          {hecho && <span className="sr-only"> (completado)</span>}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 text-xs text-tinta-2 mt-0.5">
          {actual && !hecho && <span className="font-semibold text-acento">Te toca ahora</span>}
          {tema.minutos_estimados ? (
            <span className="inline-flex items-center gap-1"><Clock aria-hidden="true" size={12} />{tema.minutos_estimados} min</span>
          ) : null}
          {tema.tipo_contenido && tema.tipo_contenido !== "Lectura" && <span>{tema.tipo_contenido}</span>}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setChatAbierto(true)}
        aria-haspopup="dialog"
        aria-label={`Preguntar al tutor sobre «${tema.nombre}»`}
        className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-tinta-2 hover:text-acento hover:bg-acento-suave"
      >
        <MessageCircle aria-hidden="true" size={20} />
      </button>
      {!hecho && (
        <Link
          href={`/sesion/nueva?materia=${materiaId}&tema=${tema.id}`}
          aria-label={`Estudiar «${tema.nombre}»`}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-acento hover:bg-acento-suave"
        >
          <Play aria-hidden="true" size={20} />
        </Link>
      )}
      {chatAbierto && <ThemeChat tema={tema} materiaNombre={materiaNombre} onClose={() => setChatAbierto(false)} />}
    </div>
  );
}
