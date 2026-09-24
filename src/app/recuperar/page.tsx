import type { Metadata } from "next";
import Link from "next/link";
import { solicitarRecuperacion } from "../login/actions";
import MarcoAuth, { CampoCorreo } from "@/components/auth/MarcoAuth";

export const metadata: Metadata = { title: "Recuperar contraseña · studia+", robots: { index: false } };

export default function RecuperarPage() {
  return (
    <MarcoAuth
      titulo="Recuperar contraseña"
      subtitulo="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva."
    >
      <form className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <button formAction={solicitarRecuperacion} className="btn-action w-full mt-1 flex justify-center min-h-11">
          Enviar enlace
        </button>
        <p className="text-center text-sm text-arctic-secondary mt-2">
          ¿La recordaste?{" "}
          <Link href="/login" className="font-semibold text-glacier-blue hover:underline underline-offset-2">
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </MarcoAuth>
  );
}
