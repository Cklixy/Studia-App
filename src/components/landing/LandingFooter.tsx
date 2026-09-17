import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white/70 backdrop-blur-md pt-8 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-black/[0.05]">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <BrandLogo />
            <p className="text-xs text-arctic-secondary text-center md:text-left mt-1">
              Tu copiloto para estudiar con dirección.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-arctic-secondary">
            <a href="#como-funciona" className="hover:text-arctic-slate transition-colors">
              Cómo funciona
            </a>
            <a href="#mapa" className="hover:text-arctic-slate transition-colors">
              Mapa de estudio
            </a>
            <a href="#enfoque" className="hover:text-arctic-slate transition-colors">
              Sesiones
            </a>
            <a href="#ia" className="hover:text-arctic-slate transition-colors">
              IA
            </a>
            <Link href="/login" className="hover:text-arctic-slate transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="hover:text-arctic-slate transition-colors">
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-arctic-tertiary">
          <p>© {currentYear} studia+. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Privacidad</span>
            <span>•</span>
            <span>Términos</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
