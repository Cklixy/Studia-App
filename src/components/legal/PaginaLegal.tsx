import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

// Marco común de las páginas legales públicas (privacidad y términos): logo, volver y tarjeta de lectura.
export default function PaginaLegal({
  titulo,
  actualizada,
  children,
}: {
  titulo: string;
  actualizada: string;
  children: React.ReactNode;
}) {
  return (
    <main id="contenido" className="min-h-screen bg-frost-base px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <BrandLogo />
          <Link href="/" className="btn-apple-ghost text-sm min-h-11 apple-tactile">
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Volver</span>
          </Link>
        </div>

        <article className="apple-card p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-arctic-slate">
          <header className="space-y-2">
            <h1 className="apple-large-title text-arctic-slate">{titulo}</h1>
            <p className="text-arctic-secondary">Última actualización: {actualizada}</p>
          </header>
          {children}
        </article>
      </div>
    </main>
  );
}

export function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="apple-title-3 text-arctic-slate">{titulo}</h2>
      {children}
    </section>
  );
}

export const lista = "list-disc pl-5 space-y-1.5";

/** Cuadro «En resumen» al inicio: lo esencial en lenguaje sencillo, antes del texto completo. */
export function Resumen({ items }: { items: React.ReactNode[] }) {
  return (
    <aside aria-labelledby="resumen-titulo" className="rounded-2xl border border-glacier-blue/20 bg-glacier-blue/[0.05] p-5 space-y-2">
      <h2 id="resumen-titulo" className="apple-headline text-arctic-slate">
        En resumen
      </h2>
      <ul className={lista}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p className="text-xs text-arctic-secondary">Este resumen es una guía. Lo que vale es el texto completo de abajo.</p>
    </aside>
  );
}
