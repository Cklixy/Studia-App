import Link from "next/link";

// Selector entre las dos vistas de «Progreso» del dock (Historial y Logros)
export default function NavProgreso({ activo }: { activo: "historial" | "logros" }) {
  const opciones = [
    { clave: "historial", etiqueta: "Historial", href: "/historial" },
    { clave: "logros", etiqueta: "Logros", href: "/logros" },
  ] as const;
  return (
    <nav aria-label="Vistas de progreso" className="inline-flex p-1 rounded-2xl bg-black/[0.04] border border-black/[0.05]">
      {opciones.map((o) => (
        <Link
          key={o.clave}
          href={o.href}
          aria-current={activo === o.clave ? "page" : undefined}
          className={`min-h-11 px-5 inline-flex items-center rounded-xl text-sm font-semibold transition-colors ${
            activo === o.clave ? "bg-white text-arctic-slate shadow-apple-sm" : "text-arctic-secondary hover:text-arctic-slate"
          }`}
        >
          {o.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
