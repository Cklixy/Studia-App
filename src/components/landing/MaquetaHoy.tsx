import { Play } from "lucide-react";

// La pantalla «Hoy» de studia+, dibujada con los mismos estilos del producto y datos de ejemplo
// sin fechas absolutas (la landing es estática: una fecha fija quedaría vieja, hallazgo D-08).
// Para lectores de pantalla es una imagen con descripción; su interior se oculta.
const SEMANA = [
  { d: "L", hecho: true },
  { d: "M", hecho: true },
  { d: "X", hecho: true },
  { d: "J", hoy: true },
  { d: "V" },
  { d: "S" },
  { d: "D" },
];

export default function MaquetaHoy() {
  return (
    <div
      role="img"
      aria-label="Vista previa de la pantalla Hoy de studia+: el siguiente paso es estudiar Límites al infinito de Cálculo I durante 25 minutos, con el parcial en 6 días y una racha de 3 días."
      className="relative mx-auto w-full max-w-[340px]"
    >
      <div aria-hidden="true" className="rounded-[2.25rem] border border-linea bg-fondo p-3 shadow-3">
        <div className="rounded-[1.75rem] bg-fondo px-4 pt-5 pb-4 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="font-display text-lg text-tinta">studia<span className="text-acento">+</span></span>
            <span className="text-tinta-2 font-medium">Hoy</span>
          </div>
          <div className="font-display text-[1.75rem] leading-tight text-tinta mt-4">Hola, Ana.</div>
          <div className="text-sm text-tinta-2">Esto es lo que te conviene hacer ahora.</div>

          <div className="tarjeta p-4 mt-4">
            <div className="text-xs font-semibold text-tinta-2">Tu siguiente paso · Cálculo I</div>
            <div className="font-display text-[1.375rem] leading-snug text-tinta mt-1.5">
              <span className="resaltado">Límites al infinito</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="chip">25 min</span>
              <span className="chip chip-aviso">Parcial en 6 días</span>
            </div>
            <div className="btn-primario w-full mt-4 text-sm">
              <Play size={16} />
              Empezar sesión
            </div>
          </div>

          <div className="tarjeta p-4 mt-3">
            <div className="grid grid-cols-7 gap-1 text-center">
              {SEMANA.map(({ d, hecho, hoy }) => (
                <div key={d}>
                  <div className="text-[0.6875rem] font-semibold text-tinta-3">{d}</div>
                  <div
                    className={`mx-auto mt-1 w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center text-[0.625rem] font-bold ${
                      hecho ? "bg-acento border-acento text-sobre-acento" : hoy ? "border-dashed border-acento text-acento" : "border-linea-fuerte"
                    }`}
                  >
                    {hecho ? "✓" : hoy ? "hoy" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-tinta-2 mt-3">
              <strong className="text-tinta">3 días seguidos.</strong> Una sesión hoy lo convierte en 4.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
