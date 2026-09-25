import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "../login/actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import BotonEnviar from "@/components/auth/BotonEnviar";
import { LONGITUD_MINIMA_CONTRASENA } from "@/lib/auth/mensajes";

export const metadata: Metadata = { title: "Crear cuenta · studia+" };

// Dos campos y nada más: el nombre y las materias se piden después, cuando ya aportan algo.
export default function RegisterPage() {
  return (
    <MarcoAuth
      titulo="Crea tu cuenta"
      subtitulo="Gratis y sin tarjeta. En un minuto tendrás tu primer plan de estudio."
      pie={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-acento underline underline-offset-2">Entra</Link>
        </>
      }
    >
      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <CampoContrasena
          autoComplete="new-password"
          minLength={LONGITUD_MINIMA_CONTRASENA}
          ayuda={`Mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres. Puedes pegarla desde tu gestor de contraseñas.`}
        />
        <BotonEnviar accion={signup} textoEnviando="Creando tu cuenta…">Crear cuenta</BotonEnviar>
      </form>
    </MarcoAuth>
  );
}
