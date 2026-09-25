import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = { title: "Página no encontrada · studia+" };

// Antes se mostraba el 404 por defecto de Next, en inglés y sin forma de volver.
export default function NotFound() {
  return (
    <main id="contenido" className="min-h-screen bg-fondo flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-superficie rounded-3xl border border-linea shadow-2 p-8 text-center">
        <BrandLogo className="justify-center mb-6" />
        <p className="text-sm font-semibold text-acento">Error 404</p>
        <h1 className="text-2xl font-bold text-tinta mt-1">No encontramos esta página</h1>
        <p className="text-sm text-tinta-2 mt-2">
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/materias" className="btn-primario text-sm min-h-11 px-5 inline-flex items-center justify-center">
            Ir a mis materias
          </Link>
          <Link href="/" className="btn-secundario text-sm min-h-11 px-5 inline-flex items-center justify-center">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
