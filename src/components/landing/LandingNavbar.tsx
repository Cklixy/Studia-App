"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { ArrowRight, Menu, X } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";
import { CTA_PRINCIPAL } from "@/lib/landing";

export default function LandingNavbar() {
  const user = useHaySesion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Izquierda: Brand Logo */}
        <div className="flex items-center gap-8">
          <BrandLogo />

          {/* Centro: Links Desktop */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-arctic-secondary">
            <a href="#como-funciona" className="hover:text-arctic-slate transition-colors">
              Cómo funciona
            </a>
            <a href="#funciones" className="hover:text-arctic-slate transition-colors">
              Funciones
            </a>
            <a href="#preguntas" className="hover:text-arctic-slate transition-colors">
              Preguntas
            </a>
          </nav>
        </div>

        {/* Derecha: Acciones Desktop */}
        <div className="hidden md:flex items-center gap-3">
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
                className="btn-apple-primary text-xs py-2 px-4.5 font-semibold apple-tactile inline-flex items-center gap-1.5 shadow-apple-sm rounded-full"
              >
                <span>{CTA_PRINCIPAL}</span>
                <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>

        {/* Botón Móvil Hamburguesa */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-arctic-slate hover:bg-black/[0.04] transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Menú Móvil Desplegable estilo iOS */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/[0.06] bg-white/95 backdrop-blur-2xl px-6 py-5 space-y-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-arctic-slate">
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-glacier-blue transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href="#funciones"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-glacier-blue transition-colors"
            >
              Funciones
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-glacier-blue transition-colors"
            >
              Preguntas
            </a>
          </nav>

          <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/materias"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-apple-primary text-xs py-2.5 px-4 font-semibold text-center rounded-full"
              >
                Ir a mis materias
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-center text-arctic-secondary py-2"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-apple-primary text-xs py-2.5 px-4 font-semibold text-center rounded-full"
                >
                  {CTA_PRINCIPAL} →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
