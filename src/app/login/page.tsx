import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import BotonEnviar from "@/components/auth/BotonEnviar";

export const metadata: Metadata = { title: "Entrar · studia+" };

export default function LoginPage() {
  return (
    <MarcoAuth
      titulo="Hola de nuevo"
      subtitulo="Entra para ver qué te toca estudiar hoy."
      pie={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-acento underline underline-offset-2">Crea una gratis</Link>
        </>
      }
    >
      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <div className="flex flex-col gap-2">
          <CampoContrasena autoComplete="current-password" />
          <Link href="/recuperar" className="self-end inline-flex min-h-11 items-center text-sm font-semibold text-acento underline underline-offset-2">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <BotonEnviar accion={login} textoEnviando="Entrando…">Entrar</BotonEnviar>
      </form>
    </MarcoAuth>
  );
}
