"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, History, Star, Sparkles, Settings, Timer, Trophy } from "lucide-react";

const links = [
  { name: "Mis Materias", href: "/materias", icon: Map },
  { name: "Historial", href: "/historial", icon: History },
  { name: "Evaluaciones", href: "/evaluaciones", icon: Star },
  { name: "Plan IA", href: "/rutas", icon: Sparkles },
  { name: "Mis Logros", href: "/logros", icon: Trophy },
  { name: "Nueva Sesión", href: "/sesion/nueva", icon: Timer },
  { name: "Ajustes", href: "/ajustes", icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 flex-1">
      {links.map(({ name, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-signal-lime/10 text-signal-lime"
                : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
