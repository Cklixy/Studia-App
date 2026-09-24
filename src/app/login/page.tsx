import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";

export const metadata: Metadata = { title: "Iniciar sesión · studia+" };

export default function LoginPage() {
  return (
    <MarcoAuth titulo="Iniciar sesión" subtitulo="Ingresa a tu cuenta de studia+">
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
