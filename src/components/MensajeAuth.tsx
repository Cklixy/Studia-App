"use client";

import { useSearchParams } from "next/navigation";

// Muestra el ?message= que dejan las server actions de login/registro.
// Leerlo en el cliente permite que /login y /registro sean páginas estáticas:
// con searchParams en el servidor eran dinámicas y se servían con Cache-Control: no-store.
export default function MensajeAuth({ variante }: { variante: "login" | "registro" }) {
  const mensaje = useSearchParams().get("message");
  if (!mensaje) return null;

  if (variante === "registro") {
    return (
      <div role="status" className="mt-4 p-4 border border-warm-coral/30 text-warm-coral bg-warm-coral/5 rounded-lg text-center text-sm font-medium">
        {mensaje}
      </div>
    );
  }

  const texto = mensaje.toLowerCase();
  const esExito = texto.includes("éxito") || texto.includes("exitosamente") || texto.includes("correo");

  return (
    <div
      role="status"
      className={`mt-4 p-3.5 rounded-xl text-center text-xs font-medium border ${
        esExito
          ? "border-emerald-500/30 text-emerald-700 bg-emerald-500/10"
          : "border-warm-coral/30 text-warm-coral bg-warm-coral/5"
      }`}
    >
      {mensaje}
    </div>
  );
}
