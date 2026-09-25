import { Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";
import MensajeAuth from "@/components/MensajeAuth";

// Marco común de las pantallas de acceso: landmark <main>, un único h1 y el aviso
// (?tipo=&message=) que dejan las server actions.
export default function MarcoAuth({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <main id="contenido" className="min-h-screen bg-frost-base flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-0 w-[500px] h-[500px] bg-glacier-blue/5 rounded-full blur-[120px] pointer-events-none -mt-32 -mr-32" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-black/[0.06] shadow-apple-md p-6 sm:p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo className="mb-4" />
          <h1 className="apple-title-2 text-arctic-slate text-center">{titulo}</h1>
          <p className="text-sm text-arctic-secondary mt-1 text-center">{subtitulo}</p>
        </div>

        <Suspense fallback={null}>
          <MensajeAuth />
        </Suspense>

        {children}
      </div>
    </main>
  );
}

export function CampoCorreo({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-semibold text-arctic-slate mb-2">
        Correo electrónico
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus={autoFocus}
        required
        placeholder="tu@correo.com"
        className="w-full px-4 py-3 rounded-xl bg-white border border-arctic-borde text-arctic-slate text-base placeholder:text-arctic-secondary focus:border-glacier-blue focus:ring-2 focus:ring-glacier-blue/25 outline-none transition-colors"
      />
    </div>
  );
}
