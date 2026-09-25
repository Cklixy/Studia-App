interface BarraProgresoProps {
  /** 0–100 */
  valor: number;
  /** Nombre accesible, p. ej. «Temas listos de Cálculo I» */
  etiqueta: string;
  /** Texto del valor para lectores de pantalla, p. ej. «3 de 7 temas» */
  textoValor?: string;
  tono?: "acento" | "exito" | "aviso";
  className?: string;
}

const tonos = { acento: "bg-acento", exito: "bg-exito", aviso: "bg-aviso" };

/** Barra de progreso con role=progressbar. El valor debe mostrarse también en texto junto a ella. */
export default function BarraProgreso({ valor, etiqueta, textoValor, tono = "acento", className = "" }: BarraProgresoProps) {
  const v = Math.max(0, Math.min(100, Math.round(valor)));
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-valuetext={textoValor}
      className={`barra-progreso ${className}`}
    >
      <span className={tonos[tono]} style={{ width: `${v}%` }} />
    </div>
  );
}
