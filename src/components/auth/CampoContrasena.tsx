"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Campo de contraseña con botón para mostrarla (ayuda en móvil y a personas con dislexia)
// y ayuda enlazada con aria-describedby.
export default function CampoContrasena({
  id = "password",
  etiqueta = "Contraseña",
  autoComplete,
  ayuda,
  minLength,
}: {
  id?: string;
  etiqueta?: string;
  autoComplete: "current-password" | "new-password";
  ayuda?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  const idAyuda = `${id}-ayuda`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-tinta">
        {etiqueta}
      </label>
      <div className="relative">
        <input
          id={id}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          aria-describedby={ayuda ? idAyuda : undefined}
          className="campo pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg text-tinta-2 hover:text-tinta"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {ayuda && (
        <p id={idAyuda} className="text-xs text-tinta-2">
          {ayuda}
        </p>
      )}
    </div>
  );
}
