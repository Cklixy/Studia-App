import Link from "next/link";

export default function BrandLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      {/* Icono de Marca (Un cuadrado oscuro con un + asimétrico de rutas cruzadas) */}
      <div className="w-10 h-10 bg-deep-surface border border-white/10 rounded-lg flex items-center justify-center relative shadow-lg overflow-hidden group">
        {/* Glow sutil al hacer hover */}
        <div className="absolute inset-0 bg-electric-periwinkle/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Ruta vertical (Electric Periwinkle) */}
        <div className="absolute w-[3px] h-6 bg-electric-periwinkle rounded-full transform -translate-x-[2px] transition-transform group-hover:scale-y-110 duration-300"></div>
        
        {/* Ruta horizontal (Signal Lime) */}
        <div className="absolute h-[3px] w-6 bg-signal-lime rounded-full transform translate-y-[2px] transition-transform group-hover:scale-x-110 duration-300"></div>
      </div>
      
      {/* Texto Tipográfico studia+ */}
      {showText && (
        <span className="text-2xl font-bold font-sans tracking-tight">
          studia<span className="text-electric-periwinkle font-black">+</span>
        </span>
      )}
    </Link>
  );
}
