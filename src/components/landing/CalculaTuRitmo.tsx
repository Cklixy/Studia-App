"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { calcularPlanParcial } from "@/lib/planParcial";
import { fechaLocal, restarDias } from "@/lib/racha";

// Prueba sin cuenta (Fase 3: «ver valor antes de registrarse»): usa la misma lógica del
// «Plan hasta el parcial» de la app con los números que escriba el estudiante.
export default function CalculaTuRitmo() {
  const id = useId();
  const [dias, setDias] = useState(10);
  const [temas, setTemas] = useState(6);

  const hoy = fechaLocal();
  const plan = calcularPlanParcial(
    {
      id: "demo",
      nombre: "Tu materia",
      fecha_parcial: restarDias(hoy, -Math.max(0, dias)),
      temas: Array.from({ length: Math.max(0, temas) }, (_, i) => ({ id: String(i), nombre: `Tema ${i + 1}`, estado: "pendiente" })),
    },
    hoy
  );

  // Reparto visual: hasta 14 días; el último, repaso
  const diasVisibles = Math.min(Math.max(dias, 0), 14);
  let quedan = temas;
  const reparto = Array.from({ length: diasVisibles }, (_, i) => {
    const esRepaso = dias > 1 && i === dias - 1;
    if (esRepaso) return { etiqueta: "Repaso", n: 0 };
    const n = Math.min(quedan, plan?.temasPorDia || 0);
    quedan -= n;
    return { etiqueta: n ? `${n}` : "Libre", n };
  });

  const numero = (valor: number, fijar: (n: number) => void, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Math.round(Number(e.target.value));
    fijar(Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : valor);
  };

  return (
    <div className="tarjeta p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-dias`} className="text-sm font-semibold">¿En cuántos días es tu parcial?</label>
          <input id={`${id}-dias`} type="number" inputMode="numeric" min={0} max={60} value={dias} onChange={numero(dias, setDias, 60)} className="campo" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-temas`} className="text-sm font-semibold">¿Cuántos temas te faltan?</label>
          <input id={`${id}-temas`} type="number" inputMode="numeric" min={0} max={40} value={temas} onChange={numero(temas, setTemas, 40)} className="campo" />
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-lg font-semibold text-tinta">
        {plan?.mensaje ?? "Escribe cuántos días faltan para tu parcial."}
      </p>

      {diasVisibles > 1 && temas > 0 && (
        <ol aria-label="Reparto de temas por día" className="mt-4 flex flex-wrap gap-1.5">
          {reparto.map((d, i) => (
            <li
              key={i}
              className={`min-w-[3.25rem] rounded-xl border px-2 py-1.5 text-center ${
                d.etiqueta === "Repaso" ? "border-aviso/40 bg-aviso-suave text-aviso" : d.n ? "border-acento/30 bg-acento-suave text-acento" : "border-linea text-tinta-3"
              }`}
            >
              <span className="block text-xs font-semibold">Día {i + 1}</span>
              <span className="block text-sm font-bold">{d.etiqueta === "Repaso" ? "Repaso" : d.n ? `${d.n} ${d.n === 1 ? "tema" : "temas"}` : "Libre"}</span>
            </li>
          ))}
          {dias > 14 && <li className="self-center text-sm text-tinta-2">… y {dias - 14} días más</li>}
        </ol>
      )}

      <p className="mt-5 text-sm text-tinta-2">
        En la app, este plan se arma solo con la fecha de tu parcial y se actualiza cada vez que terminas un tema.{" "}
        <Link href="/registro" className="font-semibold text-acento underline underline-offset-2">Créalo con tus materias</Link>
      </p>
    </div>
  );
}
