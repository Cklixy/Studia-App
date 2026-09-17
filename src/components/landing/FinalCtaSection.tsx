import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface FinalCtaSectionProps {
  user?: { email?: string; id?: string } | null;
}

export default function FinalCtaSection({ user }: FinalCtaSectionProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="rounded-[32px] bg-white border border-black/[0.08] shadow-[0_20px_50px_-12px_rgba(0,25,60,0.08)] p-8 sm:p-14 md:p-16 text-center relative overflow-hidden">
        
        {/* Resplandor suave de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-glacier-blue/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-glacier-blue/10 text-glacier-blue text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} />
            Tu estudio, con un plan
          </span>

          <h2 className="fluid-h2 font-bold tracking-tight text-arctic-slate">
            Empieza tu próxima sesión.
          </h2>

          <p className="text-sm sm:text-base text-arctic-secondary max-w-lg mx-auto leading-relaxed">
            Organiza tu estudio, encuentra tu siguiente paso y ponte en modo enfoque.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={user ? "/materias" : "/registro"}
              className="btn-apple-primary text-sm sm:text-base py-3 px-8 font-semibold apple-tactile inline-flex items-center gap-2 shadow-apple-sm rounded-full w-full sm:w-auto justify-center"
            >
              <span>{user ? "Ir a mis materias" : "Crear mi cuenta"}</span>
              <ArrowRight size={16} />
            </Link>
            
            {!user && (
              <Link
                href="/login"
                className="btn-apple-secondary text-sm sm:text-base py-3 px-6 font-semibold apple-tactile rounded-full w-full sm:w-auto justify-center"
              >
                <span>Ya tengo cuenta</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
