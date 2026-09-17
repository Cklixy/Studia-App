import { signup } from "../login/actions";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="min-h-screen bg-deep-ink flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-electric-periwinkle/5 rounded-full blur-[120px] pointer-events-none -mt-32 -ml-32"></div>

      <div className="w-full max-w-md surface-elevated p-6 sm:p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <BrandLogo className="mb-4" />
          <h1 className="text-xl font-display font-medium text-text-primary text-center">Traza tu primer movimiento.</h1>
        </div>
        
        <form className="flex flex-col gap-6 text-text-primary">
          <div>
            <label className="block text-sm uppercase tracking-widest text-text-secondary font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-deep-surface border border-white/10 focus:border-electric-periwinkle outline-none transition-colors"
              name="email"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm uppercase tracking-widest text-text-secondary font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg bg-deep-surface border border-white/10 focus:border-electric-periwinkle outline-none transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            formAction={signup}
            className="btn-action w-full mt-2 flex justify-center"
          >
            Crear Mapa
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-text-secondary">¿Ya tienes un sistema? </span>
            <Link href="/login" className="text-sm text-electric-periwinkle font-bold hover:text-white transition-colors">
              Ingresa aquí
            </Link>
          </div>

          {searchParams?.message && (
            <div className="mt-4 p-4 border border-warm-coral/30 text-warm-coral bg-warm-coral/5 rounded-lg text-center text-sm font-medium">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
