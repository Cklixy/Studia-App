"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/app/login/actions";
import { CampoCorreo } from "@/components/auth/MarcoAuth";
import CampoContrasena from "@/components/auth/CampoContrasena";
import BotonGoogle, { SeparadorO } from "@/components/auth/BotonGoogle";
import { LONGITUD_MINIMA_CONTRASENA } from "@/lib/auth/mensajes";

const enlace = "font-semibold text-glacier-blue underline underline-offset-2";

/**
 * Registro con aceptación expresa: hay que marcar la casilla de la política de privacidad y los
 * términos para crear la cuenta, tanto con correo como con Google. El servidor lo vuelve a comprobar.
 */
export default function FormularioRegistro() {
  const [acepta, setAcepta] = useState(false);

  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-arctic-borde bg-white p-3.5 mb-5">
        <input
          type="checkbox"
          name="acepta"
          form="registro-correo"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          required
          aria-describedby="acepta-ayuda"
          className="mt-0.5 w-5 h-5 shrink-0 rounded accent-[#0066CC] cursor-pointer"
        />
        <span id="acepta-ayuda" className="text-sm text-arctic-slate leading-snug">
          He leído y acepto la{" "}
          <Link href="/privacidad" target="_blank" rel="noopener" className={enlace}>
            Política de privacidad
          </Link>{" "}
          y los{" "}
          <Link href="/terminos" target="_blank" rel="noopener" className={enlace}>
            Términos y condiciones
          </Link>
          , y autorizo el tratamiento de mis datos como allí se describe.
        </span>
      </label>

      <BotonGoogle texto="Registrarme con Google" deshabilitado={!acepta} aceptoTerminos />
      {!acepta && <p className="mt-2 text-xs text-arctic-secondary text-center">Marca la casilla para continuar.</p>}
      <SeparadorO />

      <form id="registro-correo" className="flex flex-col gap-5">
        <CampoCorreo autoFocus />
        <CampoContrasena
          autoComplete="new-password"
          minLength={LONGITUD_MINIMA_CONTRASENA}
          ayuda={`Mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres. Evita contraseñas que uses en otros sitios.`}
        />

        <button formAction={signup} disabled={!acepta} className="btn-action w-full mt-1 flex justify-center min-h-11 disabled:opacity-50">
          Crear cuenta
        </button>

        <p className="text-center text-sm text-arctic-secondary mt-2">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-glacier-blue hover:underline underline-offset-2">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
