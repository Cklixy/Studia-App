"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

// Cierra sesión con la ruta de servidor POST /auth/signout, que borra las cookies y
// redirige a /login. Así /ajustes no carga el cliente de Supabase en el navegador
// (~70 kB gzip solo para signOut).
export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <form action="/auth/signout" method="post" onSubmit={() => setIsLoggingOut(true)}>
      <button
        type="submit"
        disabled={isLoggingOut}
        className="flex items-center gap-2 px-4 py-2 bg-cool-berry/10 hover:bg-cool-berry/20 text-cool-berry rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        <LogOut size={18} />
        {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>
    </form>
  );
}
