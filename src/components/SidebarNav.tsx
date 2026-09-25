"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, BookOpen, CalendarDays, BarChart3, Settings } from "lucide-react";

// Dock de 5 destinos con etiqueta visible, en la zona del pulgar (principio 4).
// «Estudiar» dejó de ser un destino: es la acción principal de «Hoy» y de cada materia.
const links = [
  { name: "Hoy", href: "/hoy", icon: Sun, activoEn: ["/hoy", "/sesion"] },
  { name: "Materias", href: "/materias", icon: BookOpen, activoEn: ["/materias", "/rutas"] },
  { name: "Parciales", href: "/evaluaciones", icon: CalendarDays, activoEn: ["/evaluaciones"] },
  { name: "Progreso", href: "/historial", icon: BarChart3, activoEn: ["/historial", "/logros"] },
  { name: "Ajustes", href: "/ajustes", icon: Settings, activoEn: ["/ajustes"] },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="grid grid-cols-5 gap-1 bg-superficie border-t border-linea sm:border sm:rounded-3xl sm:shadow-3 px-1.5 pt-1.5 sm:p-1.5 select-none"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom, 0px))" }}
    >
      {links.map(({ name, href, icon: Icon, activoEn }) => {
        const activo = activoEn.some((ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? "page" : undefined}
            className={`group flex flex-col items-center justify-center gap-0.5 min-h-14 sm:min-w-[5.5rem] rounded-2xl text-xs font-semibold transition-colors duration-rapida ${
              activo ? "text-acento" : "text-tinta-2 hover:text-tinta"
            }`}
          >
            <span
              className={`flex items-center justify-center h-7 w-14 rounded-full transition-colors duration-rapida ${
                activo ? "bg-acento-suave" : "group-hover:bg-hundido"
              }`}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={activo ? 2.4 : 2} />
            </span>
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
