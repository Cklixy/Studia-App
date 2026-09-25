"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

// Botón de envío de las pantallas de acceso: muestra progreso y evita el doble envío
// mientras la server action responde (antes no había ninguna señal de que algo pasaba).
export default function BotonEnviar({
  accion,
  children,
  textoEnviando,
}: {
  accion: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  textoEnviando: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button formAction={accion} disabled={pending} aria-disabled={pending} className="btn-primario w-full min-h-12 text-base">
      {pending ? (
        <>
          <Loader2 aria-hidden="true" size={18} className="animate-spin" />
          {textoEnviando}
        </>
      ) : (
        children
      )}
    </button>
  );
}
