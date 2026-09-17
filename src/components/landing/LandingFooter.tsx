import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white/70 backdrop-blur-md pt-12 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-black/[0.05]">
          <div className="flex flex-col items-center md:items-start gap-2">
            <BrandLogo />
            <p className="text-xs text-arctic-secondary text-center md:text-left mt-1">
              Tu copiloto de navegación académica impulsado por IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-arctic-secondary">
            <Link href="/login" className="hover:text-arctic-slate transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="hover:text-arctic-slate transition-colors">
              Crear Cuenta
            </Link>
            <a href="#caracteristicas" className="hover:text-arctic-slate transition-colors">
              Funcionalidades
            </a>
            <a href="#ia" className="hover:text-arctic-slate transition-colors">
              Inteligencia Artificial
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-arctic-secondary">
          <p>© {currentYear} studia+. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-green" />
              Sistemas operativos
            </span>
            <span>•</span>
            <span>Diseñado para la excelencia académica</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
