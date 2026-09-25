import type { Metadata } from "next";
import Link from "next/link";
import { solicitarRecuperacion } from "../login/actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";
import BotonEnviar from "@/components/auth/BotonEnviar";

export const metadata: Metadata = { title: "Recuperar contraseña · studia+", robots: { index: false } };

export default function RecuperarPage() {
  return (
    <MarcoAuth
      titulo="Recupera tu contraseña"
      subtitulo="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva."
      pie={
        <>
          ¿La recordaste?{" "}
          <Link href="/login" className="font-semibold text-acento underline underline-offset-2">Volver a entrar</Link>
        </>
      }
    >
      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <BotonEnviar accion={solicitarRecuperacion} textoEnviando="Enviando…">Enviar enlace</BotonEnviar>
      </form>
    </MarcoAuth>
  );
}
