import { CalendarCheck, Timer, MessageCircleQuestion, Calculator, ChevronDown } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import HeroCta from "@/components/landing/HeroCta";
import EnlaceCuenta from "@/components/landing/EnlaceCuenta";
import MaquetaHoy from "@/components/landing/MaquetaHoy";
import CalculaTuRitmo from "@/components/landing/CalculaTuRitmo";
import LandingFooter from "@/components/landing/LandingFooter";

// Landing estática (sin consultar la sesión en el servidor). Rediseño «Cuaderno», Fase 3:
// propuesta de valor en 5 segundos, un CTA principal, 3 pasos, prueba sin cuenta, qué es gratis y FAQ.

const PASOS = [
  { titulo: "Anota tus materias", texto: "Crea cada materia con la fecha de su parcial y los temas que entran. Toma un minuto." },
  { titulo: "Mira qué toca hoy", texto: "studia+ reparte los temas hasta el parcial, deja el día anterior para repasar y te muestra el siguiente paso." },
  { titulo: "Estudia y avanza", texto: "Sesiones con temporizador, un método sugerido y un tutor con IA para tus dudas. Tu progreso se guarda solo." },
];

const FUNCIONES = [
  { icono: CalendarCheck, titulo: "Plan hasta el parcial", texto: "Cuántos temas por día necesitas y cuál sigue, según la fecha de tu parcial." },
  { icono: Timer, titulo: "Sesiones de foco", texto: "Temporizador grande y sin distracciones. Si cierras la app, tu sesión te espera." },
  { icono: MessageCircleQuestion, titulo: "Tutor con IA", texto: "Pregúntale sobre cada tema: explica paso a paso y te recuerda que puede equivocarse." },
  { icono: Calculator, titulo: "Tus notas", texto: "Registra tus notas y mira cuánto necesitas en lo que falta para aprobar con 3,0." },
];

const PREGUNTAS = [
  { p: "¿Es gratis de verdad?", r: "Sí. No hay plan de pago y no te pedimos tarjeta. Las funciones con IA tienen límites de uso para que alcancen para todos: por ejemplo, 10 preguntas por minuto al tutor y 3 planes con IA por hora." },
  { p: "¿Tengo que instalar algo?", r: "No. Funciona en el navegador del celular o del computador. Si quieres, puedes agregarla a la pantalla de inicio de tu celular como una app." },
  { p: "¿La IA me hace las tareas?", r: "No es para eso. El tutor te explica los temas y te ayuda a entender, pero puede equivocarse: compara siempre con tus apuntes, tu libro o tu profesor." },
  { p: "¿Qué pasa si un día no estudio?", r: "Tu racha vuelve a empezar, pero tu XP y tus insignias no se pierden. studia+ te propone el siguiente paso para retomar sin culpa." },
  { p: "¿Quién ve mis materias y mis notas?", r: "Solo tú. Desde Ajustes puedes descargar todos tus datos o borrar tu cuenta cuando quieras." },
  { p: "¿Sirve si no estoy en la universidad?", r: "Está pensada para la universidad, pero funciona con cualquier materia que tenga temas y evaluaciones. Las notas usan la escala de 0 a 5." },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="barra-superior sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo />
          <EnlaceCuenta />
        </div>
      </header>

      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero: qué es, para quién y qué hacer, en la primera pantalla */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="chip chip-acento">Gratis · hecho para universitarios</p>
            <h1 className="font-display font-semibold text-[2.625rem] leading-[1.05] tracking-tight sm:text-6xl mt-4">
              Estudia <span className="resaltado">lo que toca</span> hoy.
            </h1>
            <p className="text-lg text-tinta-2 mt-5 max-w-xl">
              Anota tus materias y la fecha de tus parciales. studia+ te dice qué tema estudiar cada día, te acompaña con un temporizador y un tutor con IA, y te recuerda estudiar si se te pasa.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <HeroCta />
            </div>
            <p className="text-sm text-tinta-2 mt-4">Sin tarjeta. Solo tu correo y una contraseña.</p>
          </div>
          <MaquetaHoy />
        </section>

        {/* Cómo funciona: 3 pasos, numerados como en una libreta */}
        <section id="como-funciona" aria-labelledby="titulo-como" className="border-t border-linea bg-superficie scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <p className="antetitulo">Cómo funciona</p>
            <h2 id="titulo-como" className="titulo-2 sm:text-3xl mt-2 max-w-xl">De «tengo parcial» a «sé qué estudiar hoy» en tres pasos.</h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {PASOS.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-4 sm:flex-col sm:gap-3">
                  <span aria-hidden="true" className="font-display text-4xl leading-none text-acento w-10 shrink-0">{i + 1}</span>
                  <div>
                    <h3 className="titulo-3">{paso.titulo}</h3>
                    <p className="text-tinta-2 mt-1">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Prueba sin cuenta */}
        <section id="prueba" aria-labelledby="titulo-prueba" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-16">
          <p className="antetitulo">Pruébalo ahora</p>
          <h2 id="titulo-prueba" className="titulo-2 sm:text-3xl mt-2">¿Cuánto tienes que estudiar cada día?</h2>
          <p className="text-tinta-2 mt-2 mb-6">Escribe tus números. Es el mismo cálculo que usa la app, sin crear cuenta.</p>
          <CalculaTuRitmo />
        </section>

        {/* Funciones */}
        <section id="funciones" aria-labelledby="titulo-funciones" className="border-t border-linea bg-superficie">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <p className="antetitulo">Qué incluye</p>
            <h2 id="titulo-funciones" className="titulo-2 sm:text-3xl mt-2">Todo lo que necesitas para llegar preparado.</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {FUNCIONES.map(({ icono: Icono, titulo, texto }) => (
                <li key={titulo} className="rounded-2xl border border-linea bg-fondo p-5 flex gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-acento-suave text-acento flex items-center justify-center">
                    <Icono aria-hidden="true" size={22} />
                  </span>
                  <div>
                    <h3 className="titulo-3">{titulo}</h3>
                    <p className="text-tinta-2 mt-1">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border-2 border-acento/30 bg-acento-suave p-6">
              <h3 className="titulo-3">¿Cuánto cuesta? Nada.</h3>
              <p className="text-tinta-2 mt-1 max-w-2xl">
                studia+ es gratis: materias, plan hasta el parcial, sesiones, tutor con IA, notas y recordatorios. No hay versión de pago ni anuncios.
              </p>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes (details nativo: accesible y sin JavaScript) */}
        <section id="preguntas" aria-labelledby="titulo-preguntas" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-16">
          <p className="antetitulo">Preguntas frecuentes</p>
          <h2 id="titulo-preguntas" className="titulo-2 sm:text-3xl mt-2">Lo que suelen preguntar</h2>
          <div className="mt-8 divide-y divide-linea border-y border-linea">
            {PREGUNTAS.map(({ p, r }) => (
              <details key={p} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-tinta [&::-webkit-details-marker]:hidden">
                  {p}
                  <ChevronDown aria-hidden="true" size={20} className="shrink-0 text-tinta-2 transition-transform duration-media group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-tinta-2 max-w-2xl">{r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <section aria-labelledby="titulo-cierre" className="border-t border-linea bg-superficie">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 id="titulo-cierre" className="titulo-2 sm:text-4xl">Tu próximo parcial ya tiene fecha.<br />Ahora puede tener plan.</h2>
            <div className="mt-7 flex justify-center">
              <HeroCta secundaria={false} />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
