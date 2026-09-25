import {
  CalendarClock,
  Headphones,
  ListChecks,
  MessageCircle,
  Route,
  Sparkles,
  Target,
  Flame,
  Bell,
  Calculator,
  SlidersHorizontal,
  Layers,
  Compass,
  Timer,
  ChevronDown,
} from "lucide-react";
import HeroCta from "./HeroCta";
import FinalCtaSection from "./FinalCtaSection";
import { MockHabitos, MockMetodo, MockNotas, MockParaHoy, MockRuta, MockTarjetaEnfoque, MockTutor } from "./Mockups";
import { PREGUNTAS_FRECUENTES } from "@/lib/landing";

// Secciones de la landing (plan de la landing, fase B): una sola historia en 8 pasos.
// qué es → por qué → un día con studia+ → sesión → parcial → hábito → dudas → empezar.
// Un único h1 (hero); cada sección un h2 y sus puntos como h3. Todo se renderiza en el servidor.

const CONTENEDOR = "px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1200px] mx-auto w-full";

interface Punto {
  icono: React.ElementType;
  titulo: string;
  texto: string;
}

function ListaPuntos({ puntos }: { puntos: Punto[] }) {
  return (
    <ul className="space-y-5 mt-8">
      {puntos.map(({ icono: Icono, titulo, texto }) => (
        <li key={titulo} className="flex gap-4">
          <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center shrink-0">
            <Icono size={19} />
          </span>
          <div>
            <h3 className="apple-headline text-arctic-slate">{titulo}</h3>
            <p className="text-sm text-arctic-secondary mt-0.5 leading-relaxed">{texto}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Sección con texto a un lado y mockup al otro; `invertida` alterna el orden en escritorio. */
function SeccionFuncion({
  id,
  etiqueta,
  titulo,
  texto,
  puntos,
  mockup,
  invertida = false,
}: {
  id: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  puntos: Punto[];
  mockup: React.ReactNode;
  invertida?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={`${CONTENEDOR} scroll-mt-24`}>
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
        <div className={invertida ? "lg:order-2" : ""}>
          <p className="text-sm font-semibold tracking-wide text-glacier-blue">{etiqueta}</p>
          <h2 id={`${id}-titulo`} className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-arctic-slate mt-2">
            {titulo}
          </h2>
          <p className="text-base sm:text-lg text-arctic-secondary leading-relaxed mt-4 max-w-xl">{texto}</p>
          <ListaPuntos puntos={puntos} />
        </div>
        <div className={`space-y-4 ${invertida ? "lg:order-1" : ""}`}>{mockup}</div>
      </div>
    </section>
  );
}

/** 1. Hero: qué es studia+ y para quién, en una frase; la tarjeta de enfoque real al lado. */
export function Hero() {
  return (
    <section className={`${CONTENEDOR} pt-10 sm:pt-16 lg:pt-20`}>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold tracking-wide text-glacier-blue">Para estudiantes de universidad y colegio</p>
          <h1 className="text-[2.5rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.04em] text-arctic-slate mt-3 text-balance">
            La app de estudio que te dice qué estudiar hoy y cómo.
          </h1>
          <p className="text-lg sm:text-xl text-arctic-secondary leading-relaxed mt-6 max-w-xl mx-auto lg:mx-0">
            Organiza tus materias, sigue un plan hasta el parcial y estudia cada tema con la técnica que mejor funciona. Con
            música para concentrarte y un tutor con IA cuando te atascas.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 mt-8">
            <HeroCta />
          </div>
          <p className="text-sm text-arctic-secondary mt-4">Empieza gratis · Sin tarjeta · Tu primera materia en 1 minuto</p>
        </div>
        <MockTarjetaEnfoque />
      </div>
    </section>
  );
}

/** 2. Problema → solución (antes «Problema» y «Cómo funciona»). */
export function ProblemaSolucion() {
  const pares = [
    { icono: Layers, problema: "Demasiado contenido", solucion: "Un siguiente paso claro cada día, según tus parciales y tus temas pendientes." },
    { icono: Compass, problema: "No sabes cómo estudiarlo", solucion: "Una técnica de estudio recomendada para cada tema, con los pasos para aplicarla." },
    { icono: Timer, problema: "Te distraes", solucion: "Sesiones con tiempo, sonido de fondo y nada más en la pantalla." },
  ];
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className={`${CONTENEDOR} scroll-mt-24`}>
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold tracking-wide text-glacier-blue">Cómo funciona</p>
        <h2 id="como-funciona-titulo" className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-arctic-slate mt-2">
          Tu problema no es estudiar. Es saber por dónde empezar.
        </h2>
        <p className="text-base sm:text-lg text-arctic-secondary leading-relaxed mt-4">
          studia+ convierte un temario abrumador en un plan de estudio claro: qué toca hoy, cómo estudiarlo y cuánto tiempo.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3 mt-12">
        {pares.map(({ icono: Icono, problema, solucion }) => (
          <li key={problema} className="apple-card p-6">
            <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-black/[0.04] text-arctic-secondary flex items-center justify-center">
              <Icono size={19} />
            </span>
            <h3 className="apple-headline text-arctic-secondary line-through decoration-black/25 mt-4">{problema}</h3>
            <p className="text-base font-semibold text-arctic-slate mt-1.5 leading-snug">{solucion}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 3. Plan de estudio: «Para hoy», rutas con IA y plan hasta el parcial. */
export function PlanDeEstudio() {
  return (
    <SeccionFuncion
      id="funciones"
      etiqueta="Tu plan de estudio"
      titulo="Cada día sabes qué estudiar."
      texto="Organiza tus materias con sus temas y la fecha del parcial. studia+ mira lo que te falta y te dice qué toca hoy; si empiezas de cero, la IA arma la ruta en el orden ideal."
      puntos={[
        { icono: Target, titulo: "Para hoy", texto: "El siguiente tema de la materia con el parcial más cercano, con el motivo a la vista." },
        { icono: Route, titulo: "Rutas de estudio con IA", texto: "Describe lo que necesitas aprender y recibe los temas ordenados, con tiempo estimado." },
        { icono: CalendarClock, titulo: "Plan hasta el parcial", texto: "Cuántos temas estudiar por día y el día anterior libre para repasar." },
      ]}
      mockup={
        <>
          <MockParaHoy />
          <MockRuta />
        </>
      }
    />
  );
}

/** 4. Sesión de enfoque: método recomendado, música y tutor. */
export function SesionEnfoque() {
  return (
    <SeccionFuncion
      id="sesion"
      etiqueta="Sesión de estudio"
      titulo="La técnica de estudio correcta, sin distracciones."
      texto="Eliges el tema y tu situación, y studia+ te recomienda cómo estudiarlo: Active Recall, método Pomodoro, técnica Feynman y más. Durante la sesión solo ves el tiempo."
      invertida
      puntos={[
        { icono: Sparkles, titulo: "Método recomendado", texto: "Según el tema y lo que necesitas (repasar, entender desde cero, practicar), con pasos concretos." },
        { icono: Headphones, titulo: "Música para concentrarte", texto: "Lluvia, lo-fi, ruido de fondo o tu playlist de Spotify, junto al temporizador." },
        { icono: MessageCircle, titulo: "Tutor con IA", texto: "Si te atascas, pregunta y recibe una explicación paso a paso del mismo tema." },
      ]}
      mockup={
        <>
          <MockMetodo />
          <MockTutor />
        </>
      }
    />
  );
}

/** 5. Parciales y notas. */
export function ParcialesNotas() {
  return (
    <SeccionFuncion
      id="parciales"
      etiqueta="Parciales y notas"
      titulo="Sabe cuánto necesitas para aprobar."
      texto="Registra tus notas y el porcentaje de cada evaluación. studia+ calcula tu nota acumulada y cuánto necesitas sacar en lo que falta, para que prepares el parcial con números, no con nervios."
      puntos={[
        { icono: Calculator, titulo: "Nota acumulada al día", texto: "Solo cuenta lo que ya tiene nota: un parcial pendiente no se toma como un cero." },
        { icono: ListChecks, titulo: "Cuánto necesitas", texto: "El promedio que te falta en el porcentaje restante para llegar a 3,0." },
        { icono: SlidersHorizontal, titulo: "¿Y si saco…?", texto: "Mueve la nota esperada y mira al instante cómo quedaría tu nota final." },
      ]}
      mockup={<MockNotas />}
    />
  );
}

/** 6. Hábitos y progreso. */
export function Habitos() {
  return (
    <SeccionFuncion
      id="habitos"
      etiqueta="Hábitos de estudio"
      titulo="Convierte el estudio en un hábito."
      texto="Cada sesión suma a tu racha, a tu meta semanal y a tu nivel. Sin culpa: si un día no estudias, empiezas de nuevo y no pierdes tu progreso."
      invertida
      puntos={[
        { icono: Flame, titulo: "Racha diaria", texto: "Días seguidos con al menos una sesión, en hora de Colombia." },
        { icono: Target, titulo: "Meta semanal", texto: "Elige cuántas horas quieres estudiar a la semana y mira tu avance." },
        { icono: Bell, titulo: "Recordatorio diario", texto: "Un aviso por la tarde los días que aún no has estudiado." },
      ]}
      mockup={<MockHabitos />}
    />
  );
}

/** 7. Preguntas frecuentes (acordeón nativo: accesible y sin JavaScript). */
export function PreguntasFrecuentes() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className={`${CONTENEDOR} max-w-3xl scroll-mt-24`}>
      <h2 id="preguntas-titulo" className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-arctic-slate text-center">
        Preguntas frecuentes
      </h2>
      <div className="apple-card p-0 mt-10 divide-y divide-black/[0.06] overflow-hidden">
        {PREGUNTAS_FRECUENTES.map(({ pregunta, respuesta }) => (
          <details key={pregunta} className="group">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-4 min-h-14 hover:bg-black/[0.02] [&::-webkit-details-marker]:hidden">
              <h3 className="apple-headline text-arctic-slate">{pregunta}</h3>
              <ChevronDown size={18} aria-hidden="true" className="text-arctic-secondary shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-arctic-secondary leading-relaxed">{respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** 8. CTA final. */
export function CtaFinal() {
  return <FinalCtaSection />;
}
