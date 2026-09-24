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
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-arctic-slate mb-2">
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
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-arctic-borde text-arctic-slate text-base focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg text-arctic-secondary hover:text-arctic-slate"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {ayuda && (
        <p id={idAyuda} className="text-xs text-arctic-secondary mt-1.5">
          {ayuda}
        </p>
      )}
    </div>
  );
}
