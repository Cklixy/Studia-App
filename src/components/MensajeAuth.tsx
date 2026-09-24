"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Muestra el ?message= que dejan las server actions de acceso.
// El tipo llega explícito en ?tipo=error|exito: antes se adivinaba por palabras
// ("correo" = éxito) y "Correo o contraseña incorrectos" salía en verde (auditoría A-01).
// Leerlo en el cliente permite que /login y /registro sigan siendo páginas estáticas.
export default function MensajeAuth() {
  const params = useSearchParams();
  const mensaje = params.get("message");
  if (!mensaje) return null;

  const esExito = params.get("tipo") === "exito";

  return (
    <div
      role={esExito ? "status" : "alert"}
      className={`mb-6 p-3.5 rounded-xl text-sm font-medium border flex items-start gap-2.5 ${
        esExito
          ? "border-emerald-600/30 text-emerald-800 bg-emerald-500/10"
          : "border-cool-berry/30 text-cool-berry bg-cool-berry/5"
      }`}
    >
      {esExito ? (
        <CheckCircle2 size={18} className="shrink-0 mt-px" aria-hidden="true" />
      ) : (
        <AlertCircle size={18} className="shrink-0 mt-px" aria-hidden="true" />
      )}
      <span>{mensaje}</span>
    </div>
  );
}
