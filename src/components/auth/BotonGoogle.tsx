"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Inicio de sesión y registro con Google (OAuth de Supabase, flujo PKCE). Si la cuenta no existe se
// crea sola. Vuelve a /auth/confirm, que ya intercambia el ?code= por la sesión y entra a la app.
export default function BotonGoogle({ texto = "Continuar con Google" }: { texto?: string }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entrar = async () => {
    setCargando(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=/materias` },
    });
    // Si todo sale bien el navegador ya está yendo a Google; aquí solo se llega si falló
    if (error) {
      setError("No pudimos conectar con Google. Inténtalo de nuevo.");
      setCargando(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={entrar}
        disabled={cargando}
        className="w-full min-h-11 px-4 inline-flex items-center justify-center gap-3 rounded-full bg-white border border-arctic-borde text-sm font-semibold text-arctic-slate hover:bg-frost-base transition-colors apple-tactile disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <span>{cargando ? "Conectando con Google…" : texto}</span>
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-cool-berry text-center">
          {error}
        </p>
      )}
    </div>
  );
}

/** Separador «o» entre el botón de Google y el formulario de correo. */
export function SeparadorO() {
  return (
    <div className="flex items-center gap-3 my-5" role="separator" aria-label="o">
      <span className="flex-1 h-px bg-black/[0.08]" />
      <span className="text-xs text-arctic-secondary">o</span>
      <span className="flex-1 h-px bg-black/[0.08]" />
    </div>
  );
}
