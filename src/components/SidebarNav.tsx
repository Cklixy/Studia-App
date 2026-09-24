"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  Compass,
  Clock,
  BookmarkCheck,
  Sparkles,
  Trophy,
  PlayCircle,
  SlidersHorizontal
} from "lucide-react";

const links = [
  { name: "Materias", href: "/materias", icon: Compass },
  { name: "Estudiar", href: "/sesion/nueva", icon: PlayCircle, highlight: true },
  { name: "Historial", href: "/historial", icon: Clock },
  { name: "Evaluaciones", href: "/evaluaciones", icon: BookmarkCheck },
  { name: "Plan IA", href: "/rutas", icon: Sparkles },
  { name: "Logros", href: "/logros", icon: Trophy },
  { name: "Ajustes", href: "/ajustes", icon: SlidersHorizontal },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full bg-white/85 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.04)] max-w-[calc(100vw-1rem)] overflow-x-auto no-scrollbar select-none"
    >
      {links.map(({ name, href, icon: Icon, highlight }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={name}
            aria-label={name}
            aria-current={isActive ? "page" : undefined}
            className={`group relative flex items-center justify-center gap-1.5 sm:gap-2.5 min-h-11 min-w-9 py-1.5 sm:py-2.5 rounded-full font-semibold transition-all duration-200 apple-tactile shrink-0 ${
              isActive
                ? "text-white font-bold px-3 sm:px-5 shadow-sm"
                : "text-arctic-slate/75 hover:text-arctic-slate hover:bg-black/[0.04] px-2 sm:px-3.5"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeDockPill"}
                className="absolute inset-0 rounded-full bg-glacier-blue shadow-apple-glow"
                transition={shouldReduceMotion ? { duration: 0 } : {
                  type: "spring",
                  damping: 28,
                  stiffness: 380,
                }}
              />
            )}

            <span className="relative z-10 flex items-center justify-center">
              <Icon
                aria-hidden="true"
                size={19}
                strokeWidth={2}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : highlight
                    ? "text-glacier-blue group-hover:text-glacier-blue"
                    : "text-arctic-slate/70 group-hover:text-arctic-slate"
                }`}
              />
            </span>

            <span className={`relative z-10 tracking-tight text-[11px] sm:text-[13px] whitespace-nowrap transition-all duration-200 ${isActive ? 'inline' : 'hidden sm:inline'}`}>
              {name}
            </span>

            {highlight && !isActive && (
              <span aria-hidden="true" className="relative z-10 w-2 h-2 rounded-full bg-glacier-blue -ml-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
