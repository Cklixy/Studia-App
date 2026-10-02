import { Flame } from "lucide-react";
import type { DiaSemana, EstadoDia } from "@/lib/racha";

const ESTILO: Record<EstadoDia, string> = {
  hecho: "bg-cool-berry/10 border border-cool-berry/25",
  hoy: "bg-white border-2 border-glacier-blue",
  perdido: "bg-black/[0.04] border border-black/[0.06]",
  futuro: "border border-dashed border-black/[0.14]",
};

const TEXTO: Record<EstadoDia, string> = {
  hecho: "estudiaste",
  hoy: "hoy, aún sin estudiar",
  perdido: "sin estudiar",
  futuro: "por venir",
};

/** Los siete días de la semana al estilo Duolingo: llama en los días estudiados, anillo azul en hoy. */
export default function TiraSemana({ dias }: { dias: DiaSemana[] }) {
  return (
    <ol aria-label="Días de esta semana" className="grid grid-cols-7 gap-1.5">
      {dias.map((d) => (
        <li key={d.fecha} className="flex flex-col items-center gap-1.5">
          <span aria-hidden="true" className={`text-xs font-medium ${d.estado === "hoy" ? "text-glacier-blue" : "text-arctic-secondary"}`}>
            {d.letra}
          </span>
          <span aria-hidden="true" className={`w-9 h-9 rounded-full flex items-center justify-center ${ESTILO[d.estado]}`}>
            {d.estado === "hecho" && <Flame size={18} className="text-cool-berry fill-cool-berry" />}
          </span>
          <span className="sr-only">
            {d.nombre}: {TEXTO[d.estado]}
          </span>
        </li>
      ))}
    </ol>
  );
}
