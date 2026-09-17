import { login } from "./actions";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="min-h-screen bg-deep-ink flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-periwinkle/5 rounded-full blur-[120px] pointer-events-none -mt-32 -mr-32"></div>

      <div className="w-full max-w-md surface-elevated p-6 sm:p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <BrandLogo className="mb-4" />
          <h1 className="text-xl font-display font-medium text-text-primary text-center">Inicia tu próxima sesión.</h1>
        </div>

        <form className="flex flex-col gap-6 text-text-primary">
          <div>
            <label className="block text-sm uppercase tracking-widest text-text-secondary font-bold mb-2" htmlFor="email">
              Coordenadas de usuario
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
            formAction={login}
            className="btn-action w-full mt-2 flex justify-center"
          >
            Iniciar Sesión
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-text-secondary">¿Aún no tienes cuenta? </span>
            <Link href="/registro" className="text-sm text-electric-periwinkle font-bold hover:text-white transition-colors">
              Empieza aquí
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
