import type { Metadata } from "next";
import MarcoAuth from "@/components/auth/MarcoAuth";
import FormularioRegistro from "@/components/auth/FormularioRegistro";

export const metadata: Metadata = { title: "Crear cuenta gratis" };

export default function RegisterPage() {
  return (
    <MarcoAuth titulo="Crear cuenta" subtitulo="Regístrate gratis en studia+ para organizar tu estudio">
      <FormularioRegistro />
    </MarcoAuth>
  );
}
