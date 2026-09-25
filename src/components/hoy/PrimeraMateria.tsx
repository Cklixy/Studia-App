"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { invalidateMateriasAction } from "@/app/actions/materias";

// Onboarding en la propia pantalla «Hoy» (Fase 3/4): crear la primera materia sin abrir un diálogo
// y seguir directamente a sus temas. Usa el mismo endpoint que «Nueva materia».
export default function PrimeraMateria() {
  const id = useId();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Escribe el nombre de la materia.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), fecha_parcial: fecha || null }),
      });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok || !datos?.id) throw new Error(typeof datos.error === "string" ? datos.error : "No pudimos crear la materia. Inténtalo de nuevo.");
      await invalidateMateriasAction();
      router.push(`/materias/${datos.id}?nueva=1#temas`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos crear la materia.");
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={crear} noValidate className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-nombre`} className="text-sm font-semibold">Materia</label>
        <input
          id={`${id}-nombre`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          autoComplete="off"
          placeholder="Ej. Cálculo I"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="campo"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-fecha`} className="text-sm font-semibold">
          Fecha del parcial <span className="font-normal text-tinta-2">(opcional)</span>
        </label>
        <input id={`${id}-fecha`} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="campo" />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="sm:col-span-2 text-sm font-semibold text-error">
          {error}
        </p>
      )}
      <button type="submit" disabled={enviando} className="btn-primario text-base min-h-12 sm:col-span-2">
        {enviando && <Loader2 aria-hidden="true" size={18} className="animate-spin" />}
        {enviando ? "Creando…" : "Crear y agregar temas"}
      </button>
    </form>
  );
}
