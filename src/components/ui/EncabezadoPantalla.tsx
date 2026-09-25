interface EncabezadoPantallaProps {
  /** Texto pequeño sobre el título (fecha, sección) */
  etiqueta?: React.ReactNode;
  titulo: React.ReactNode;
  descripcion?: React.ReactNode;
  /** Botones o enlaces a la derecha del título (debajo en móvil) */
  acciones?: React.ReactNode;
  /** Elemento junto al título, p. ej. el botón de editar materia */
  junto?: React.ReactNode;
  centrado?: boolean;
}

/**
 * Cabecera común de las pantallas: etiqueta, h1 con apple-large-title, frase de apoyo y acciones.
 * Antes cada pantalla armaba su h1 a mano (text-3xl, text-5xl, font-display…) y la jerarquía
 * cambiaba de una a otra. Sin línea divisoria: la separación la da el espacio (skill apple-design §12).
 */
export default function EncabezadoPantalla({
  etiqueta,
  titulo,
  descripcion,
  acciones,
  junto,
  centrado = false,
}: EncabezadoPantallaProps) {
  return (
    <header
      className={`flex flex-col gap-4 ${
        centrado ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={`min-w-0 ${centrado ? "max-w-2xl" : ""}`}>
        {etiqueta && (
          <p className="text-xs font-semibold tracking-wide text-arctic-secondary">{etiqueta}</p>
        )}
        <div className={`flex items-center gap-3 mt-1 ${centrado ? "justify-center" : ""}`}>
          <h1 className="apple-large-title text-arctic-slate min-w-0 break-words">{titulo}</h1>
          {junto}
        </div>
        {descripcion && (
          <p className="text-sm text-arctic-secondary mt-1.5 max-w-xl">{descripcion}</p>
        )}
      </div>
      {acciones && (
        <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 ${centrado ? "justify-center" : ""}`}>
          {acciones}
        </div>
      )}
    </header>
  );
}
