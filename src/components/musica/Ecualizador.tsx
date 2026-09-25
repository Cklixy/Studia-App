/**
 * Tres barras que indican que hay sonido. Se mueven solo mientras suena y con movimiento reducido
 * quedan quietas (la regla global anula las animaciones). Decorativo: el estado se anuncia en texto.
 */
export default function Ecualizador({ activo, className = "" }: { activo: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-[2px] h-3 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-current origin-bottom ${activo ? "ecualizador-barra" : ""}`}
          style={{ height: activo ? "100%" : "35%", animationDelay: `${i * -0.35}s` }}
        />
      ))}
    </span>
  );
}
