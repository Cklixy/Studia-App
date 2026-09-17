import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FinalCtaSectionProps {
  user?: { email?: string; id?: string } | null;
}

export default function FinalCtaSection({ user }: FinalCtaSectionProps) {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-[1440px] mx-auto w-full py-4 sm:py-8">
      <div className="rounded-[32px] bg-white border border-black/[0.08] shadow-[0_25px_60px_-15px_rgba(0,25,60,0.07)] p-8 sm:p-16 md:p-20 text-center space-y-6">
        
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-arctic-slate">
          Tu próximo tema ya puede tener un plan.
        </h2>

        <p className="text-base sm:text-lg text-arctic-secondary max-w-lg mx-auto leading-relaxed">
          Elige qué estudiar. Descubre cómo hacerlo. Empieza.
        </p>

        <div className="pt-3 flex items-center justify-center">
          <Link
            href={user ? "/materias" : "/registro"}
            className="btn-apple-primary text-sm sm:text-base py-3.5 px-9 font-semibold apple-tactile inline-flex items-center gap-2.5 shadow-apple-md rounded-full"
          >
            <span>{user ? "Ir a mis materias" : "Empezar gratis"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
