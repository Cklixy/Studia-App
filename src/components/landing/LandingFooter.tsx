import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

// Pie sin enlaces falsos: antes «Privacidad» y «Términos» eran texto que parecía enlace.
export default function LandingFooter() {
  return (
    <footer className="border-t border-linea">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <BrandLogo />
          <p className="text-sm text-tinta-2 mt-1">Sabe qué estudiar hoy y llega preparado a tus parciales.</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-sm font-medium">
            <li><a href="#como-funciona" className="inline-flex min-h-11 items-center px-2 text-tinta-2 hover:text-tinta">Cómo funciona</a></li>
            <li><a href="#preguntas" className="inline-flex min-h-11 items-center px-2 text-tinta-2 hover:text-tinta">Preguntas</a></li>
            <li><Link href="/login" className="inline-flex min-h-11 items-center px-2 text-tinta-2 hover:text-tinta">Entrar</Link></li>
            <li><Link href="/registro" className="inline-flex min-h-11 items-center px-2 text-tinta-2 hover:text-tinta">Crear cuenta</Link></li>
          </ul>
        </nav>
      </div>
      <p className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 text-sm text-tinta-2">
        studia+ usa Gemini, de Google, para el tutor y las recomendaciones. Tus datos son tuyos: puedes descargarlos o borrar tu cuenta desde Ajustes.
      </p>
    </footer>
  );
}
