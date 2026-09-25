import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { actualizarContrasena } from "../login/actions";
import MarcoAuth from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import { createClient } from "@/utils/supabase/server";
import { conMensaje, LONGITUD_MINIMA_CONTRASENA } from "@/lib/auth/mensajes";

export const metadata: Metadata = { title: "Nueva contraseña · studia+", robots: { index: false } };

// Se llega aquí desde el enlace del correo, tras /auth/confirm (sesión temporal de recuperación)
export default async function NuevaContrasenaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(conMensaje("/recuperar", "error", "El enlace caducó o ya se usó. Pide uno nuevo."));
  }

  return (
    <MarcoAuth titulo="Crea una contraseña nueva" subtitulo="Después entrarás directamente a tus materias.">
      <form className="flex flex-col gap-5">
        <CampoContrasena
          etiqueta="Nueva contraseña"
          autoComplete="new-password"
          minLength={LONGITUD_MINIMA_CONTRASENA}
          ayuda={`Mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres.`}
        />
        <button formAction={actualizarContrasena} className="btn-primario w-full mt-1 flex justify-center min-h-11">
          Guardar contraseña
        </button>
      </form>
    </MarcoAuth>
  );
}
