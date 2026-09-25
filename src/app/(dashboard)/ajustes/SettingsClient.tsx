"use client";

import { useId, useState } from "react";
import { Download, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import LogoutButton from "./LogoutButton";
import SelectorTema from "./SelectorTema";
import PushNotificationManager from "@/components/PushNotificationManager";
import Dialogo from "@/components/ui/Dialogo";

// Ajustes (rediseño 4.7): una sola página agrupada en lugar de pestañas (a 390 px se cortaban y
// escondían lo importante). Solo ajustes que funcionan de verdad (auditoría U-07).
export default function SettingsClient({ email }: { email: string }) {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="aj-cuenta" className="flex flex-col gap-3">
        <h2 id="aj-cuenta" className="titulo-2">Cuenta</h2>
        <div className="tarjeta p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-tinta-2">Correo</p>
            <p className="font-semibold text-tinta break-all">{email}</p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section aria-labelledby="aj-apariencia" className="flex flex-col gap-3">
        <h2 id="aj-apariencia" className="titulo-2">Apariencia</h2>
        <div className="tarjeta p-5">
          <SelectorTema />
        </div>
      </section>

      <section aria-labelledby="aj-recordatorios" className="flex flex-col gap-3">
        <h2 id="aj-recordatorios" className="titulo-2">Recordatorios</h2>
        <div className="tarjeta p-5">
          <PushNotificationManager compacto />
        </div>
      </section>

      <PrivacidadYDatos />
    </div>
  );
}

function PrivacidadYDatos() {
  const idConfirmacion = useId();
  const [dialogo, setDialogo] = useState(false);
  const [confirmacion, setConfirmacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/cuenta/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmacion }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "No se pudo eliminar la cuenta.");
      window.location.href = "/?cuenta=eliminada";
    } catch (err: any) {
      setError(err.message);
      setCargando(false);
    }
  };

  return (
    <section aria-labelledby="aj-datos" className="flex flex-col gap-3">
      <h2 id="aj-datos" className="titulo-2">Tus datos</h2>
      <div className="tarjeta divide-y divide-linea">
        <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="encabezado">Descargar mis datos</h3>
            <p className="text-sm text-tinta-2">Un archivo con tus materias, temas, sesiones, notas y progreso.</p>
          </div>
          <a href="/api/cuenta/exportar" download className="btn-secundario shrink-0">
            <Download aria-hidden="true" size={18} /> Descargar
          </a>
        </div>
        <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="encabezado">Eliminar mi cuenta</h3>
            <p className="text-sm text-tinta-2">Borra tu cuenta y todos tus datos para siempre. Descárgalos antes si los quieres.</p>
          </div>
          <button
            type="button"
            onClick={() => { setConfirmacion(""); setError(null); setDialogo(true); }}
            aria-haspopup="dialog"
            className="btn-peligro shrink-0"
          >
            <Trash2 aria-hidden="true" size={18} /> Eliminar cuenta
          </button>
        </div>
      </div>

      <Dialogo
        abierto={dialogo}
        onCerrar={() => setDialogo(false)}
        titulo="¿Eliminar tu cuenta?"
        descripcion="Esta acción no se puede deshacer."
        tono="peligro"
        anchoMaximo="sm"
        icono={
          <div className="w-9 h-9 rounded-xl bg-error-suave text-error flex items-center justify-center">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
        }
      >
        <form onSubmit={eliminarCuenta} className="flex flex-col gap-4">
          <p className="text-tinta">Se borrarán tus materias, temas, sesiones, notas, planes, racha y XP.</p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={idConfirmacion} className="text-sm font-semibold">
              Escribe <strong>ELIMINAR</strong> para confirmar
            </label>
            <input
              id={idConfirmacion}
              data-autofocus
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              className="campo"
            />
          </div>
          {error && <p role="alert" className="rounded-xl bg-error-suave p-3 text-sm font-semibold text-error">{error}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button type="button" onClick={() => setDialogo(false)} className="flex-1 btn-secundario">Cancelar</button>
            <button type="submit" disabled={confirmacion !== "ELIMINAR" || cargando} className="flex-1 btn-peligro">
              {cargando && <Loader2 aria-hidden="true" size={18} className="animate-spin" />}
              {cargando ? "Eliminando…" : "Eliminar para siempre"}
            </button>
          </div>
        </form>
      </Dialogo>
    </section>
  );
}
