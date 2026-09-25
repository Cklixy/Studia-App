import Link from "next/link";
import { Check } from "lucide-react";
import { plural } from "@/lib/texto";

type Dia = { letra: string; fecha: string; hecho: boolean; esHoy: boolean; futuro: boolean };

const NOMBRES: Record<string, string> = { L: "lunes", M: "martes", X: "miércoles", J: "jueves", V: "viernes", S: "sábado", D: "domingo" };

// Racha como semana (principio 6): lo que ya hiciste se ve marcado; un día sin estudiar es un
// círculo vacío, no un contador que cae a cero. El texto nunca regaña.
export default function SemanaRacha({
  dias,
  racha,
  rachaAnterior,
  estudioHoy,
  xpSemana,
}: {
  dias: Dia[];
  racha: number;
  rachaAnterior: number;
  estudioHoy: boolean;
  xpSemana: number;
}) {
  const mensaje =
    racha > 0 && estudioHoy
      ? { fuerte: `¡Hoy ya cuenta! ${plural(racha, "día seguido", "días seguidos")}.`, resto: "Vuelve mañana para sumar otro." }
      : racha > 0
        ? { fuerte: `${plural(racha, "día seguido", "días seguidos")}.`, resto: `Una sesión hoy lo convierte en ${racha + 1}.` }
        : rachaAnterior > 1
          ? { fuerte: `Tu racha anterior fue de ${rachaAnterior} días.`, resto: "Tu XP sigue ahí. Hoy es buen día para empezar otra." }
          : { fuerte: "Cada día que estudies se marca aquí.", resto: "Con una sesión corta basta." };

  return (
    <section aria-labelledby="titulo-semana">
      <h2 id="titulo-semana" className="antetitulo mb-3">Tu semana</h2>
      <div className="tarjeta p-4 sm:p-5">
        <ol className="grid grid-cols-7 gap-1 text-center">
          {dias.map((d) => (
            <li key={d.fecha}>
              <span aria-hidden="true" className={`block text-xs font-semibold ${d.esHoy ? "text-acento" : "text-tinta-3"}`}>{d.letra}</span>
              <span
                className={`mx-auto mt-1.5 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                  d.hecho
                    ? "bg-acento text-sobre-acento"
                    : d.esHoy
                      ? "border-2 border-dashed border-acento text-acento"
                      : d.futuro
                        ? "border border-linea"
                        : "border-[1.5px] border-linea-fuerte"
                }`}
              >
                {d.hecho ? <Check aria-hidden="true" size={16} strokeWidth={3} /> : d.esHoy ? <span aria-hidden="true">hoy</span> : null}
                <span className="sr-only">
                  {NOMBRES[d.letra]}
                  {d.esHoy ? " (hoy)" : ""}: {d.hecho ? "estudiaste" : d.futuro ? "aún no llega" : d.esHoy ? "pendiente" : "sin sesión"}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-tinta-2 mt-4">
          <strong className="text-tinta">{mensaje.fuerte}</strong> {mensaje.resto}
        </p>
        <div className="mt-3 pt-3 border-t border-linea flex items-center justify-between text-sm">
          <span className="text-tinta-2">
            Esta semana: <strong className="text-tinta">+{xpSemana} XP</strong>
          </span>
          <Link href="/logros" className="inline-flex min-h-11 items-center font-semibold text-acento">
            Tu progreso
          </Link>
        </div>
      </div>
    </section>
  );
}
