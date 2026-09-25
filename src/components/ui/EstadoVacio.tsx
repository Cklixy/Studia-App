import type { LucideIcon } from "lucide-react";

interface EstadoVacioProps {
  icono: LucideIcon;
  titulo: string;
  /** Qué significa que esté vacío y qué ganas al llenarlo */
  texto: string;
  /** Acción principal (botón o enlace). Todo estado vacío debe ofrecer una salida. */
  accion?: React.ReactNode;
  /** Nivel del encabezado según la jerarquía de la página */
  nivel?: "h2" | "h3";
  className?: string;
}

/** Estado vacío del sistema: icono decorativo, título, explicación y una acción clara. */
export default function EstadoVacio({ icono: Icono, titulo, texto, accion, nivel = "h2", className = "" }: EstadoVacioProps) {
  const Titulo = nivel;
  return (
    <div className={`tarjeta flex flex-col items-center text-center px-6 py-10 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-hundido flex items-center justify-center text-tinta-2 mb-4">
        <Icono aria-hidden="true" size={22} />
      </div>
      <Titulo className="titulo-3">{titulo}</Titulo>
      <p className="subtitulo max-w-sm mt-1.5">{texto}</p>
      {accion && <div className="mt-5 flex flex-wrap justify-center gap-3">{accion}</div>}
    </div>
  );
}
