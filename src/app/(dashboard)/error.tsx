"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

// Error de una pantalla con sesión: se mantienen la cabecera y el dock, y se ofrece reintentar.
// Antes un fallo del servidor mostraba la pantalla genérica de Next.
export default function ErrorDashboard({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="max-w-lg mx-auto apple-card p-8 text-center mt-6">
      <div className="w-12 h-12 rounded-2xl bg-cool-berry/10 text-cool-berry flex items-center justify-center mx-auto mb-4" aria-hidden="true">
        <AlertTriangle size={22} />
      </div>
      <h1 className="text-xl font-bold text-arctic-slate">No pudimos cargar esta pantalla</h1>
      <p className="text-sm text-arctic-secondary mt-2">
        Puede ser un problema de conexión o un error temporal. Tus datos no se han perdido.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button type="button" onClick={reset} className="btn-apple-primary text-sm min-h-11 px-5 inline-flex items-center justify-center gap-2">
          <RotateCcw size={15} aria-hidden="true" /> Reintentar
        </button>
        <Link href="/materias" className="btn-apple-secondary text-sm min-h-11 px-5 inline-flex items-center justify-center">
          Ir a mis materias
        </Link>
      </div>
    </div>
  );
}
