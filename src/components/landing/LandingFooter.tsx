import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white/70 backdrop-blur-md pt-10 pb-14 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-6">
        
        {/* Fila Principal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-black/[0.05]">
          <div className="flex flex-col items-center md:items-start gap-1">
            <BrandLogo />
            <p className="text-xs text-arctic-secondary text-center md:text-left">
              Tu copiloto para estudiar con dirección.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-arctic-secondary">
            <a href="#como-funciona" className="hover:text-arctic-slate transition-colors">
              Cómo funciona
            </a>
            <a href="#funciones" className="hover:text-arctic-slate transition-colors">
              Funciones
            </a>
            <a href="#preguntas" className="hover:text-arctic-slate transition-colors">
              Preguntas
            </a>
            <Link href="/login" className="hover:text-arctic-slate transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </div>

        {/* Fila Inferior con Mención Discreta a Gemini y Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-arctic-tertiary text-center sm:text-left">
          <p>© {currentYear} studia+. Todos los derechos reservados.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-1">
            <span>Privacidad</span>
            <span>•</span>
            <span>Términos</span>
            <span>•</span>
            <span className="text-arctic-secondary font-medium">
              IA integrada · Powered by Gemini
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
