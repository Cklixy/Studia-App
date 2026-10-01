"use client";

import { useState } from "react";
import { PRECIO_PRO_COP } from "@/lib/plan";

// Inicia el pago del Pro: pide al servidor la URL del checkout de Wompi y va a ella.
export default function BotonPagarPro() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pagar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/pagos/checkout", { method: "POST" });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok || !datos.url) throw new Error(datos.error || "No se pudo iniciar el pago. Intenta de nuevo.");
      window.location.href = datos.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el pago. Intenta de nuevo.");
      setCargando(false);
    }
  };

  return (
    <>
      <button type="button" onClick={pagar} disabled={cargando} className="btn-apple-primary w-full min-h-12 text-sm disabled:opacity-50">
        {cargando ? "Abriendo el pago…" : `Pasar a Pro · ${PRECIO_PRO_COP.toLocaleString("es-CO")} COP`}
      </button>
      {error && <p role="alert" className="text-sm text-red-700 mt-2 text-center">{error}</p>}
      <p className="text-xs text-arctic-secondary mt-2 text-center">Pago único por 30 días con Nequi, PSE o tarjeta, a través de Wompi.</p>
    </>
  );
}
