import Link from "next/link";

// Logotipo «Cuaderno»: la palabra en Fraunces y el «+» en tinta azul. Sin imagen: carga nada y se adapta al tema.
export default function BrandLogo({ className = "", href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="studia+, ir al inicio"
      className={`inline-flex items-center min-h-11 font-display text-[1.375rem] leading-none tracking-tight text-tinta hover:text-acento transition-colors ${className}`}
    >
      studia<span className="text-acento" aria-hidden="true">+</span>
    </Link>
  );
}
