import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import BotonGoogle, { SeparadorO } from "@/components/auth/BotonGoogle";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <MarcoAuth titulo="Iniciar sesión" subtitulo="Ingresa a tu cuenta de studia+">
      <BotonGoogle texto="Continuar con Google" />
      <p className="mt-2 text-xs text-arctic-secondary text-center">
        Si todavía no tienes cuenta, al continuar con Google aceptas la{" "}
        <Link href="/privacidad" className="font-semibold text-glacier-blue underline underline-offset-2">
          Política de privacidad
        </Link>{" "}
        y los{" "}
        <Link href="/terminos" className="font-semibold text-glacier-blue underline underline-offset-2">
          Términos
        </Link>
        .
      </p>
      <SeparadorO />

      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <div>
          <CampoContrasena autoComplete="current-password" />
          <div className="mt-2 text-right">
            <Link href="/recuperar" className="text-sm font-semibold text-glacier-blue hover:underline underline-offset-2">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <button formAction={login} className="btn-action w-full mt-1 flex justify-center min-h-11">
          Iniciar sesión
        </button>

        <p className="text-center text-sm text-arctic-secondary mt-2">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-glacier-blue hover:underline underline-offset-2">
            Regístrate
          </Link>
        </p>
      </form>
    </MarcoAuth>
  );
}
