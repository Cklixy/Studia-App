import { Suspense } from "react";
import BrandLogo from "@/components/BrandLogo";
import MensajeAuth from "@/components/MensajeAuth";

// Marco común de las pantallas de acceso (rediseño «Cuaderno»): en el móvil ocupa la pantalla sin
// tarjeta, para que el teclado no tape el botón; en pantallas anchas, una hoja centrada.
// Un único h1 y el aviso (?tipo=&message=) que dejan las server actions.
export default function MarcoAuth({
  titulo,
  subtitulo,
  children,
  pie,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  /** Enlace alternativo bajo el formulario (p. ej. «¿Ya tienes cuenta?») */
  pie?: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center">
        <BrandLogo />
      </header>
      <main id="contenido" className="flex-1 flex sm:items-center justify-center px-4 pb-10 pt-4 sm:p-6">
        <div className="w-full max-w-md sm:tarjeta sm:p-10">
          <h1 className="titulo-1">{titulo}</h1>
          <p className="subtitulo mt-2 mb-7">{subtitulo}</p>

          <Suspense fallback={null}>
            <MensajeAuth />
          </Suspense>

          {children}

          {pie && <p className="text-center text-sm text-tinta-2 mt-8">{pie}</p>}
        </div>
      </main>
    </div>
  );
}

export function CampoCorreo({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-sm font-semibold text-tinta">
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
        className="campo"
      />
    </div>
  );
}
