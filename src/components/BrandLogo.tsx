import Link from "next/link";
import Image from "next/image";

export default function BrandLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className} group`}>
      {/* Icono Oficial de Marca en Cristal Squircle */}
      <div className="w-9 h-9 relative rounded-xl overflow-hidden shadow-apple-sm border border-black/[0.08] transition-transform duration-200 group-hover:scale-105 shrink-0">
        <Image
          src="/favicon.svg"
          alt="studia+ icon"
          width={36}
          height={36}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      
      {/* Texto Tipográfico studia+ en Grafito Pizarra */}
      {showText && (
        <span className="text-xl font-bold font-sans tracking-tight text-arctic-slate transition-colors group-hover:text-glacier-blue">
          studia<span className="text-glacier-blue font-extrabold">+</span>
        </span>
      )}
    </Link>
  );
}
