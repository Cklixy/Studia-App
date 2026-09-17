import { redirect } from "next/navigation";

/**
 * Server Component: Redirecciona al usuario hacia materias si no se proporciona un ID de sesión.
 * Elimina 'use client', hooks y librerías cliente innecesarias.
 */
export default function SesionActivaRedirectPage() {
  redirect("/materias");
}
