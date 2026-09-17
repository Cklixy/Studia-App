"use client";

import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { ArrowRight } from "lucide-react";

interface LandingNavbarProps {
  user?: { email?: string; id?: string } | null;
}

export default function LandingNavbar({ user }: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <BrandLogo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-arctic-secondary">
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
            <a href="#parciales" className="hover:text-arctic-slate transition-colors">
              Parciales
            </a>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/materias"
              className="btn-apple-primary text-xs py-2 px-4 font-semibold apple-tactile inline-flex items-center gap-1.5 shadow-apple-sm rounded-full"
            >
              <span>Ir a mis materias</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-arctic-secondary hover:text-arctic-slate px-3 py-1.5 rounded-full transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="btn-apple-primary text-xs py-2 px-4 font-semibold apple-tactile inline-flex items-center gap-1.5 shadow-apple-sm rounded-full"
              >
                <span>Empezar gratis</span>
                <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
