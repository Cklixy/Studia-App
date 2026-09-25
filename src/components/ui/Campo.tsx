import type { InputHTMLAttributes } from "react";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  etiqueta: string;
  /** Ayuda permanente bajo el campo (formato, requisitos) */
  ayuda?: string;
  /** Mensaje de error: activa aria-invalid y se anuncia */
  error?: string;
  /** Marca visual de opcional (los obligatorios no llevan asterisco: son la mayoría) */
  opcional?: boolean;
}

/** Campo de texto del sistema: etiqueta visible asociada, ayuda y error enlazados con aria-describedby. */
export default function Campo({ id, etiqueta, ayuda, error, opcional, className = "", ...resto }: CampoProps) {
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-tinta">
        {etiqueta}
        {opcional && <span className="font-normal text-tinta-2"> (opcional)</span>}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[ayudaId, errorId].filter(Boolean).join(" ") || undefined}
        className={`campo ${className}`}
        {...resto}
      />
      {ayuda && <p id={ayudaId} className="text-xs text-tinta-2">{ayuda}</p>}
      {error && (
        <p id={errorId} className="text-xs font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}
