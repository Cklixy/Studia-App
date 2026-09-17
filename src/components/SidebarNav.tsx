"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
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

  return (
    <nav 
      aria-label="Navegación principal" 
      className="flex items-center gap-0.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-300/80 shadow-[0_16px_45px_rgba(15,23,42,0.14),0_2px_6px_rgba(15,23,42,0.06)] ring-1 ring-white/90 max-w-[calc(100vw-1rem)] overflow-x-auto no-scrollbar select-none"
    >
      {links.map(({ name, href, icon: Icon, highlight }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={name}
            className={`group relative flex items-center gap-1.5 sm:gap-2.5 py-2 sm:py-3 rounded-full font-semibold transition-all duration-200 apple-tactile shrink-0 ${
              isActive
                ? "text-white font-bold px-3 sm:px-5 shadow-sm"
                : "text-arctic-slate/75 hover:text-arctic-slate hover:bg-black/[0.04] px-2 sm:px-4"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeDockPill"
                className="absolute inset-0 rounded-full bg-glacier-blue shadow-apple-glow"
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 380,
                }}
              />
            )}

            <span className="relative z-10 flex items-center justify-center">
              <Icon 
                size={20} 
                className={`transition-colors duration-200 ${
                  isActive 
                    ? "text-white" 
                    : highlight 
                    ? "text-glacier-blue group-hover:text-glacier-blue" 
                    : "text-arctic-slate/70 group-hover:text-arctic-slate"
                }`} 
              />
            </span>

            <span className={`relative z-10 tracking-tight text-[11px] sm:text-[13px] md:text-sm whitespace-nowrap transition-all duration-200 ${isActive ? 'inline' : 'hidden sm:inline'}`}>
              {name}
            </span>

            {highlight && !isActive && (
              <span className="relative z-10 w-2 h-2 rounded-full bg-glacier-blue shadow-[0_0_8px_rgba(0,113,227,0.8)] animate-pulse -ml-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
