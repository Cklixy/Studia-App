import Link from "next/link";
import { Play, Crosshair, Plus, PartyPopper } from "lucide-react";
import type { SiguientePaso } from "@/lib/siguientePaso";
import { plural } from "@/lib/texto";
import PrimeraMateria from "@/components/hoy/PrimeraMateria";

// La tarjeta que responde «¿qué hago ahora?». Contiene el único botón primario de «Hoy».
export default function TarjetaSiguientePaso({ paso }: { paso: SiguientePaso }) {
  if (paso.tipo === "primera-materia") {
    return (
      <section aria-labelledby="titulo-paso" className="tarjeta p-5 sm:p-7">
        <p className="text-sm font-semibold text-tinta-2">Empecemos · 1 minuto</p>
        <h2 id="titulo-paso" className="titulo-2 mt-2">
          ¿Cuál es tu <span className="resaltado">parcial más cercano</span>?
        </h2>
        <p className="subtitulo mt-2">
          Escribe la materia y, si ya la sabes, la fecha. Después agregas sus temas y studia+ arma tu plan día a día.
        </p>
        <PrimeraMateria />
      </section>
    );
  }

  if (paso.tipo === "todo-listo") {
    return (
      <section aria-labelledby="titulo-paso" className="tarjeta p-5 sm:p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-exito">
          <PartyPopper aria-hidden="true" size={18} /> Todo al día
        </div>
        <h2 id="titulo-paso" className="titulo-2 mt-2">Completaste todos tus temas</h2>
        <p className="subtitulo mt-2">Repasa lo que más te costó o agrega los temas de lo que viene.</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link href="/sesion/nueva" className="btn-primario"><Play aria-hidden="true" size={18} />Sesión de repaso</Link>
          <Link href="/materias" className="btn-fantasma">Ver mis materias</Link>
        </div>
      </section>
    );
  }

  if (paso.tipo === "agregar-temas") {
    return (
      <section aria-labelledby="titulo-paso" className="tarjeta p-5 sm:p-7">
        <p className="text-sm font-semibold text-tinta-2">Tu siguiente paso · {paso.materia}</p>
        <h2 id="titulo-paso" className="titulo-2 mt-2">Agrega los temas que entran</h2>
        <p className="subtitulo mt-2">Con los temas, studia+ te dice cuál estudiar primero y cuántos por día hasta el parcial.</p>
        <div className="mt-5">
          <Link href={`/materias/${paso.materiaId}#temas`} className="btn-primario w-full sm:w-auto"><Plus aria-hidden="true" size={18} />Agregar temas</Link>
        </div>
      </section>
    );
  }

  const continuar = paso.tipo === "continuar";
  const href = continuar ? `/sesion/activa/${paso.sesionId}` : `/sesion/nueva?materia=${paso.materiaId}&tema=${paso.temaId}`;
  const contexto = continuar
    ? "Tienes una sesión sin terminar"
    : `Tu siguiente paso · ${paso.materia}`;
  const detalle =
    paso.tipo === "parcial"
      ? `${paso.plan.diasRestantes === 0 ? "El parcial es hoy" : paso.plan.diasRestantes === 1 ? "El parcial es mañana" : `Parcial en ${paso.plan.diasRestantes} días`} · ${plural(paso.plan.temasPendientes, "tema pendiente", "temas pendientes")}`
      : paso.tipo === "tema"
        ? `Tema ${paso.posicion} de ${paso.total} de ${paso.materia}`
        : paso.materia
          ? `De ${paso.materia}. Tu progreso se guardó.`
          : "Tu progreso se guardó.";

  return (
    <section aria-labelledby="titulo-paso" className="tarjeta p-5 sm:p-7">
      <p className="flex items-center gap-2 text-sm font-semibold text-tinta-2">
        <Crosshair aria-hidden="true" size={16} className="text-acento" />
        {contexto}
      </p>
      <h2 id="titulo-paso" className="titulo-2 sm:text-3xl mt-2.5">
        <span className="resaltado">{paso.titulo}</span>
      </h2>
      <p className="subtitulo mt-2">{detalle}</p>
      {paso.tipo === "parcial" && paso.plan.diasRestantes <= 3 && (
        <p className="chip chip-aviso mt-3">Quedan pocos días: prioriza este tema</p>
      )}
      <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link href={href} className="btn-primario text-base min-h-12">
          <Play aria-hidden="true" size={18} />
          {continuar ? "Continuar sesión" : "Empezar sesión"}
        </Link>
        {!continuar && (
          <Link href={`/materias/${paso.materiaId}`} className="btn-fantasma">
            Elegir otro tema
          </Link>
        )}
      </div>
    </section>
  );
}
