"use client";

import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { ArrowRight, Sparkles } from "lucide-react";

interface LandingNavbarProps {
  user?: { email?: string; full_name?: string } | null;
}

export default function LandingNavbar({ user }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <BrandLogo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-arctic-secondary">
            <a href="#caracteristicas" className="hover:text-arctic-slate transition-colors">
              Funcionalidades
            </a>
            <a href="#ia" className="hover:text-arctic-slate transition-colors flex items-center gap-1">
              <Sparkles size={13} className="text-cool-iris" />
              <span>Rutas IA</span>
            </a>
            <a href="#metodologia" className="hover:text-arctic-slate transition-colors">
              Metodología
            </a>
            <a href="#metricas" className="hover:text-arctic-slate transition-colors">
              Rendimiento
            </a>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <Link
              href="/materias"
              className="btn-apple-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-sm"
            >
              <span>Ir a mis materias</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs sm:text-sm font-semibold text-arctic-secondary hover:text-arctic-slate px-3 py-2 rounded-full transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="btn-apple-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 font-semibold apple-tactile inline-flex items-center gap-1.5 shadow-apple-sm"
              >
                <span>Empezar gratis</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
