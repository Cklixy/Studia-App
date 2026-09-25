"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

// Cierra sesión con la ruta de servidor POST /auth/signout, que borra las cookies y
// redirige a /login. Así /ajustes no carga el cliente de Supabase en el navegador
// (~70 kB gzip solo para signOut). No es destructivo: botón secundario, no rojo.
export default function LogoutButton() {
  const [cerrando, setCerrando] = useState(false);

  return (
    <form action="/auth/signout" method="post" onSubmit={() => setCerrando(true)}>
      <button type="submit" disabled={cerrando} className="btn-secundario">
        {cerrando ? <Loader2 aria-hidden="true" size={18} className="animate-spin" /> : <LogOut aria-hidden="true" size={18} />}
        {cerrando ? "Cerrando sesión…" : "Cerrar sesión"}
      </button>
    </form>
  );
}
