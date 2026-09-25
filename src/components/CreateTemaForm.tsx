"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { avisar } from "@/lib/avisos";

const TIPOS = ["Lectura", "Video", "Ejercicio", "Resumen", "Otro"];

// Agregar temas con pocos toques: uno, o varios pegados (uno por línea). Usa el mismo endpoint
// una vez por tema. El tipo de contenido queda en «Más opciones» (divulgación progresiva).
export default function CreateTemaForm({ materiaId, destacado = false }: { materiaId: string; destacado?: boolean }) {
  const router = useRouter();
  const id = useId();
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("Lectura");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const nombres = texto.split(/\r?\n/).map((l) => l.replace(/^\s*[-•*\d.)]+\s*/, "").trim()).filter(Boolean);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.length) {
      setError("Escribe al menos un tema.");
      return;
    }
    setEnviando(true);
    setError(null);
    let creados = 0;
    try {
      for (const nombre of nombres.slice(0, 40)) {
        const res = await fetch(`/api/materias/${materiaId}/temas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nombre.slice(0, 150), tipo_contenido: tipo }),
        });
        if (!res.ok) {
          const datos = await res.json().catch(() => ({}));
          throw new Error(typeof datos.error === "string" ? datos.error : "No se pudo agregar el tema.");
        }
        creados++;
      }
      setTexto("");
      avisar(creados === 1 ? "Tema agregado" : `${creados} temas agregados`);
      router.refresh();
    } catch (err) {
      setError(`${creados ? `Se agregaron ${creados}. ` : ""}${err instanceof Error ? err.message : "Inténtalo de nuevo."}`);
      if (creados) router.refresh();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className={`tarjeta p-4 sm:p-5 flex flex-col gap-3 ${destacado ? "border-acento/50" : ""}`}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-temas`} className="text-sm font-semibold">
          {destacado ? "¿Qué temas entran en el parcial?" : "Agregar temas"}
        </label>
        <textarea
          id={`${id}-temas`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={destacado ? 4 : 2}
          autoFocus={destacado}
          placeholder={"Límites laterales\nDerivada por definición"}
          aria-describedby={`${id}-ayuda${error ? ` ${id}-error` : ""}`}
          aria-invalid={error ? true : undefined}
          className="campo resize-y"
        />
        <p id={`${id}-ayuda`} className="text-xs text-tinta-2">
          Uno por línea. Puedes pegar la lista del programa de la materia.
        </p>
      </div>

      <details className="text-sm">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-tinta-2">Más opciones</summary>
        <div className="flex flex-col gap-1.5 pb-1">
          <label htmlFor={`${id}-tipo`} className="text-sm font-semibold">Tipo de contenido</label>
          <select id={`${id}-tipo`} value={tipo} onChange={(e) => setTipo(e.target.value)} className="campo sm:max-w-xs">
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </details>

      {error && <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-error">{error}</p>}

      <button type="submit" disabled={enviando} className={`${destacado ? "btn-primario" : "btn-secundario"} sm:self-start`}>
        {enviando ? <Loader2 aria-hidden="true" size={18} className="animate-spin" /> : <Plus aria-hidden="true" size={18} />}
        {enviando ? "Agregando…" : nombres.length > 1 ? `Agregar ${nombres.length} temas` : "Agregar tema"}
      </button>
    </form>
  );
}
