"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Compass, PlayCircle, BookmarkCheck, BarChart3, SlidersHorizontal } from "lucide-react";

// 5 destinos con etiqueta siempre visible (antes 7 iconos sin texto en móvil — auditoría U-12).
// «Plan IA» se abre desde Inicio («Crear ruta IA») y desde cada materia; Logros vive dentro de Progreso.
const links = [
  { name: "Inicio", href: "/materias", icon: Compass, activoEn: ["/materias", "/rutas"] },
  { name: "Estudiar", href: "/sesion/nueva", icon: PlayCircle, activoEn: ["/sesion"] },
  { name: "Parciales", href: "/evaluaciones", icon: BookmarkCheck, activoEn: ["/evaluaciones"] },
  { name: "Progreso", href: "/historial", icon: BarChart3, activoEn: ["/historial", "/logros"] },
  { name: "Ajustes", href: "/ajustes", icon: SlidersHorizontal, activoEn: ["/ajustes"] },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex items-stretch gap-0.5 sm:gap-1.5 p-1 sm:p-1.5 rounded-3xl bg-superficie backdrop-blur-2xl border border-linea shadow-2 max-w-[calc(100vw-1rem)] select-none"
    >
      {links.map(({ name, href, icon: Icon, activoEn }) => {
        const isActive = activoEn.some((ruta) => pathname.startsWith(ruta));
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 min-h-12 min-w-[3.75rem] sm:min-w-0 px-2 sm:px-4 py-1.5 rounded-2xl font-semibold transition-colors duration-200 tactil ${
              isActive ? "text-sobre-acento" : "text-tinta-2 hover:text-tinta hover:bg-hundido"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeDockPill"}
                className="absolute inset-0 rounded-2xl bg-acento shadow-2"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 380 }}
              />
            )}
            <Icon aria-hidden="true" size={20} strokeWidth={2} className="relative z-10" />
            <span className="relative z-10 text-xs sm:text-[13px] tracking-tight whitespace-nowrap">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
