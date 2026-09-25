import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "../login/actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import { LONGITUD_MINIMA_CONTRASENA } from "@/lib/auth/mensajes";

export const metadata: Metadata = { title: "Crear cuenta · studia+" };

export default function RegisterPage() {
  return (
    <MarcoAuth titulo="Crear cuenta" subtitulo="Regístrate gratis en studia+ para organizar tu estudio">
      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <CampoContrasena
          autoComplete="new-password"
          minLength={LONGITUD_MINIMA_CONTRASENA}
          ayuda={`Mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres. Evita contraseñas que uses en otros sitios.`}
        />

        <button formAction={signup} className="btn-primario w-full mt-1 flex justify-center min-h-11">
          Crear cuenta
        </button>

        <p className="text-center text-sm text-tinta-2 mt-2">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-acento hover:underline underline-offset-2">
            Inicia sesión
          </Link>
        </p>
      </form>
    </MarcoAuth>
  );
}
