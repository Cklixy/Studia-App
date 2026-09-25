"use client";

import { useId, useRef, useState } from "react";
import { User, Bell, Shield, Download, Trash2, AlertTriangle } from "lucide-react";
import LogoutButton from "./LogoutButton";
import PushNotificationManager from "@/components/PushNotificationManager";
import Dialogo from "@/components/ui/Dialogo";

type Pestana = "perfil" | "notificaciones" | "privacidad";

// Solo ajustes que funcionan de verdad. Antes había interruptores sin efecto, una pestaña de
// facturación ficticia y un botón de descarga sin acción (auditoría U-07).
const PESTANAS: { key: Pestana; label: string; icon: React.ReactNode }[] = [
  { key: "perfil", label: "Mi perfil", icon: <User size={16} aria-hidden="true" /> },
  { key: "notificaciones", label: "Notificaciones", icon: <Bell size={16} aria-hidden="true" /> },
  { key: "privacidad", label: "Privacidad y datos", icon: <Shield size={16} aria-hidden="true" /> },
];

export default function SettingsClient({ email }: { email: string }) {
  const [activeTab, setActiveTab] = useState<Pestana>("perfil");
  const base = useId();
  const refs = useRef<Record<Pestana, HTMLButtonElement | null>>({ perfil: null, notificaciones: null, privacidad: null });

  // Navegación de pestañas con flechas, Inicio y Fin (patrón ARIA de tabs)
  const alTeclear = (e: React.KeyboardEvent, indice: number) => {
    const total = PESTANAS.length;
    let siguiente: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") siguiente = (indice + 1) % total;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") siguiente = (indice - 1 + total) % total;
    if (e.key === "Home") siguiente = 0;
    if (e.key === "End") siguiente = total - 1;
    if (siguiente === null) return;
    e.preventDefault();
    const clave = PESTANAS[siguiente].key;
    setActiveTab(clave);
    refs.current[clave]?.focus();
  };

  return (
    <div className="space-y-6 mt-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
      <div
        role="tablist"
        aria-label="Secciones de ajustes"
        aria-orientation="horizontal"
        className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 shrink-0"
      >
        {PESTANAS.map(({ key, label, icon }, i) => (
          <button
            key={key}
            ref={(el) => { refs.current[key] = el; }}
            role="tab"
            id={`${base}-tab-${key}`}
            aria-selected={activeTab === key}
            aria-controls={`${base}-panel-${key}`}
            tabIndex={activeTab === key ? 0 : -1}
            onClick={() => setActiveTab(key)}
            onKeyDown={(e) => alTeclear(e, i)}
            className={`flex items-center gap-2 px-3.5 min-h-11 rounded-xl text-sm font-semibold transition-all tactil whitespace-nowrap shrink-0 md:w-full ${
              activeTab === key
                ? "bg-superficie text-tinta shadow-1 border border-linea"
                : "text-tinta-2 hover:bg-hundido hover:text-tinta"
            }`}
          >
            <span className={activeTab === key ? "text-acento" : ""}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel-${activeTab}`}
        aria-labelledby={`${base}-tab-${activeTab}`}
        tabIndex={0}
        className="md:col-span-2 space-y-6 focus-visible:outline-none"
      >
        {activeTab === "perfil" && (
          <>
            <section className="tarjeta p-6 md:p-8 shadow-1">
              <h2 className="titulo-3 mb-4 flex items-center gap-2">
                <User size={18} strokeWidth={2} className="text-acento" aria-hidden="true" />
                <span>Información personal</span>
              </h2>
              <p className="block text-sm font-semibold text-tinta-2 mb-1.5">Correo electrónico</p>
              <p className="w-full bg-fondo border border-linea rounded-xl px-4 py-2.5 text-sm font-medium text-tinta break-all">
                {email}
              </p>
              <p className="text-sm text-tinta-2 mt-1.5">
                Es el correo con el que inicias sesión en studia+.
              </p>
            </section>

            <section className="tarjeta p-6 md:p-8 shadow-1">
              <h2 className="titulo-3 mb-2">Sesión</h2>
              <p className="text-sm text-tinta-2 mb-5">Cierra la sesión en este dispositivo.</p>
              <LogoutButton />
            </section>
          </>
        )}

        {activeTab === "notificaciones" && (
          <section className="tarjeta p-6 md:p-8 shadow-1">
            <h2 className="titulo-3 mb-4 flex items-center gap-2">
              <Bell size={18} strokeWidth={2} className="text-acento" aria-hidden="true" />
              <span>Notificaciones</span>
            </h2>
            <PushNotificationManager compacto />
          </section>
        )}

        {activeTab === "privacidad" && <PrivacidadYDatos />}
      </div>
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
    <>
      <section className="tarjeta p-6 md:p-8 shadow-1">
        <h2 className="titulo-3 mb-2 flex items-center gap-2">
          <Download size={18} strokeWidth={2} className="text-acento" aria-hidden="true" />
          <span>Descargar mis datos</span>
        </h2>
        <p className="text-sm text-tinta-2 mb-4">
          Un archivo JSON con tus materias, temas, sesiones, notas, rutas y progreso.
        </p>
        <a
          href="/api/cuenta/exportar"
          download
          className="btn-secundario text-sm min-h-11 px-4 inline-flex items-center gap-2 tactil"
        >
          <Download size={15} aria-hidden="true" /> Descargar (.json)
        </a>
      </section>

      <section className="tarjeta p-6 md:p-8 border border-error/20 shadow-1">
        <h2 className="titulo-3 text-error mb-2 flex items-center gap-2">
          <Trash2 size={18} strokeWidth={2} aria-hidden="true" />
          <span>Eliminar mi cuenta</span>
        </h2>
        <p className="text-sm text-tinta-2 mb-4">
          Borra tu cuenta y todos tus datos de forma permanente. Te recomendamos descargarlos antes.
        </p>
        <button
          type="button"
          onClick={() => { setConfirmacion(""); setError(null); setDialogo(true); }}
          aria-haspopup="dialog"
          className="btn-peligro text-sm min-h-11 px-4 tactil"
        >
          <Trash2 size={15} aria-hidden="true" /> Eliminar mi cuenta
        </button>
      </section>

      <Dialogo
        abierto={dialogo}
        onCerrar={() => setDialogo(false)}
        titulo="¿Eliminar tu cuenta?"
        descripcion="Esta acción no se puede deshacer."
        tono="peligro"
        anchoMaximo="sm"
        icono={
          <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
        }
      >
        <form onSubmit={eliminarCuenta} className="space-y-4">
          <p className="text-sm text-tinta">
            Se borrarán tus materias, temas, sesiones, notas, rutas, racha y XP.
          </p>
          <div>
            <label htmlFor={idConfirmacion} className="block text-sm font-medium text-tinta mb-1.5">
              Escribe <strong>ELIMINAR</strong> para confirmar
            </label>
            <input
              id={idConfirmacion}
              data-autofocus
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              className="w-full rounded-xl px-4 py-2.5 bg-superficie border border-linea-fuerte focus:border-error focus:ring-2 focus:ring-error/25 outline-none text-base text-tinta"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-error bg-error/10 border border-error/20 rounded-xl p-3">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => setDialogo(false)} className="flex-1 btn-fantasma text-sm min-h-11 tactil">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={confirmacion !== "ELIMINAR" || cargando}
              className="flex-1 btn-peligro text-sm min-h-11 disabled:opacity-50 tactil"
            >
              {cargando ? "Eliminando…" : "Eliminar definitivamente"}
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
