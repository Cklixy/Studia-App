import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = { title: "Página no encontrada · studia+" };

// Antes se mostraba el 404 por defecto de Next, en inglés y sin forma de volver.
export default function NotFound() {
  return (
    <main id="contenido" className="min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      <BrandLogo className="mb-8" />
      <p className="antetitulo">Error 404</p>
      <h1 className="titulo-1 mt-2">No encontramos esta página</h1>
      <p className="subtitulo mt-3 max-w-sm">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/materias" className="btn-primario">Ir a mi día</Link>
        <Link href="/" className="btn-secundario">Ir al inicio</Link>
      </div>
    </main>
  );
}
