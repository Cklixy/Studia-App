import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, Snowflake } from "lucide-react";
import { fechaLocal, moverMes, semanasDelMes } from "@/lib/racha";
import { capitalizarInicio } from "@/lib/texto";

const LETRAS = ["L", "M", "M", "J", "V", "S", "D"];

/** Calendario del mes con una llama en cada día estudiado; se navega por mes con ?mes=AAAA-MM. */
export default function CalendarioRacha({ mes, estudiados, protegidos }: { mes: string; estudiados: Set<string>; protegidos: Set<string> }) {
  const hoy = fechaLocal();
  const semanas = semanasDelMes(mes, estudiados, hoy, protegidos);
  const esMesActual = mes === hoy.slice(0, 7);
  const nombreMes = capitalizarInicio(
    new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${mes}-01T12:00:00Z`))
  );
  const diasEstudiados = semanas.flat().filter((c) => c?.estado === "hecho").length;

  return (
    <section aria-labelledby="calendario-titulo" className="apple-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/logros?mes=${moverMes(mes, -1)}`}
          aria-label="Mes anterior"
          className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/[0.04] apple-tactile"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Link>
        <h2 id="calendario-titulo" className="apple-title-3 text-arctic-slate text-center">
          {nombreMes}
        </h2>
        {esMesActual ? (
          <span className="w-11 h-11" aria-hidden="true" />
        ) : (
          <Link
            href={`/logros?mes=${moverMes(mes, 1)}`}
            aria-label="Mes siguiente"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/[0.04] apple-tactile"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        )}
      </div>

      <table className="w-full table-fixed border-separate border-spacing-y-1.5">
        <caption className="sr-only">
          Días estudiados en {nombreMes}: {diasEstudiados}
        </caption>
        <thead>
          <tr>
            {LETRAS.map((l, i) => (
              <th key={i} scope="col" className="text-xs font-medium text-arctic-secondary pb-1">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semanas.map((semana, i) => (
            <tr key={i}>
              {semana.map((c, j) => (
                <td key={j} className="text-center">
                  {c && (
                    <span
                      className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm tabular-nums ${
                        c.estado === "hecho"
                          ? "bg-cool-berry/10 border border-cool-berry/25"
                          : c.estado === "protegido"
                            ? "bg-polar-cyan/10 border border-polar-cyan/30"
                            : c.estado === "hoy"
                            ? "border-2 border-glacier-blue text-glacier-blue font-semibold"
                            : c.estado === "futuro"
                              ? "text-arctic-tertiary"
                              : "text-arctic-secondary"
                      }`}
                    >
                      {c.estado === "protegido" ? (
                        <>
                          <Snowflake size={18} className="text-polar-cyan" aria-hidden="true" />
                          <span className="sr-only">{c.dia}: salvado por un protector</span>
                        </>
                      ) : c.estado === "hecho" ? (
                        <>
                          <Flame size={18} className="text-cool-berry fill-cool-berry" aria-hidden="true" />
                          <span className="sr-only">{c.dia}: estudiaste</span>
                        </>
                      ) : (
                        c.dia
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
