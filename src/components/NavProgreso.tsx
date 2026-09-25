import Link from "next/link";

// Selector entre las dos vistas de «Progreso» del dock (Historial y Logros)
export default function NavProgreso({ activo }: { activo: "historial" | "logros" }) {
  const opciones = [
    { clave: "historial", etiqueta: "Historial", href: "/historial" },
    { clave: "logros", etiqueta: "Logros", href: "/logros" },
  ] as const;
  return (
    <nav aria-label="Vistas de progreso" className="inline-flex p-1 rounded-2xl bg-hundido border border-linea">
      {opciones.map((o) => (
        <Link
          key={o.clave}
          href={o.href}
          aria-current={activo === o.clave ? "page" : undefined}
          className={`min-h-11 px-5 inline-flex items-center rounded-xl text-sm font-semibold transition-colors ${
            activo === o.clave ? "bg-superficie text-tinta shadow-1" : "text-tinta-2 hover:text-tinta"
          }`}
        >
          {o.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
