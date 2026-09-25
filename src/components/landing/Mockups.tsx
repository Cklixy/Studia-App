import { AnilloVivo } from "./Interactivos";
import { CalendarClock, CheckCircle2, Circle, Flame, Pause, Sparkles, Trophy, Zap, Star } from "lucide-react";

// Mockups de la landing: pantallas reales de la app dibujadas en HTML (no capturas), con los
// mismos tokens que la app. Son decorativos (aria-hidden): lo que muestran también está en el copy
// visible de cada sección. Sin encabezados (h2/h3) dentro, para no ensuciar el árbol de títulos.
// Se renderizan en el servidor: no suman JavaScript.

function Marco({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`apple-card p-5 sm:p-6 select-none ${className}`}>
      {children}
    </div>
  );
}

function Barra({ valor, className = "bg-glacier-blue" }: { valor: number; className?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${valor}%` }} />
    </div>
  );
}

function Ecualizador() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3 text-glacier-blue">
      {[70, 100, 55].map((h, i) => (
        <span key={i} className="w-[3px] rounded-full bg-current" style={{ height: `${h}%` }} />
      ))}
    </span>
  );
}

/** Tarjeta de enfoque de la sesión activa: anillo, tiempo, pausa y fila «Sonando». */
export function MockTarjetaEnfoque() {
  return (
    <Marco className="max-w-sm mx-auto w-full shadow-apple-lg">
      <p className="text-xs font-semibold tracking-wide text-arctic-secondary text-center">Cálculo I</p>
      <p className="apple-title-3 text-arctic-slate text-center mt-0.5">Límites laterales</p>
      <AnilloVivo />
      <div className="w-14 h-14 rounded-full bg-white border border-black/[0.08] shadow-apple-md flex items-center justify-center mx-auto">
        <Pause size={22} fill="currentColor" className="text-arctic-slate" />
      </div>
      <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-glacier-blue text-white flex items-center justify-center shrink-0">
          <Ecualizador />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-semibold text-arctic-slate">Lluvia</span>
          <span className="block text-xs text-arctic-secondary">Sonando · Ambiente</span>
        </span>
      </div>
    </Marco>
  );
}

/** Tarjeta «Para hoy» del inicio. */
export function MockParaHoy() {
  return (
    <Marco>
      <p className="text-xs font-semibold tracking-wide text-glacier-blue">Para hoy</p>
      <p className="apple-title-3 text-arctic-slate mt-1.5">Derivada por definición</p>
      <p className="text-sm text-arctic-secondary">Cálculo I</p>
      <p className="flex items-center gap-1.5 text-sm text-arctic-slate mt-2.5">
        <CalendarClock size={15} className="text-glacier-blue" />
        Parcial en 6 días · 5 temas pendientes
      </p>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-arctic-secondary">
          <span>3 de 8 temas para el parcial</span>
          <span>38%</span>
        </div>
        <Barra valor={38} />
      </div>
      <div className="mt-4 btn-apple-primary text-sm min-h-11 w-full">Empezar a estudiar</div>
    </Marco>
  );
}

/** Ruta de estudio generada con IA. */
export function MockRuta() {
  const temas = [
    { n: "Límites y continuidad", hecho: true },
    { n: "Límites laterales", hecho: true },
    { n: "Derivada por definición", siguiente: true },
    { n: "Reglas de derivación" },
    { n: "Regla de la cadena" },
  ];
  return (
    <Marco className="p-0 sm:p-0 overflow-hidden">
      <p className="flex items-center gap-2 px-5 pt-4 pb-3 apple-headline text-arctic-slate">
        <Sparkles size={15} className="text-cool-iris" /> Ruta de estudio: Derivadas
      </p>
      <ol className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
        {temas.map((t, i) => (
          <li key={t.n} className={`flex items-center gap-3 px-5 py-3 ${t.siguiente ? "bg-glacier-blue/[0.05]" : ""}`}>
            {t.hecho ? <CheckCircle2 size={20} className="text-glacier-blue shrink-0" /> : <Circle size={20} className="text-arctic-borde shrink-0" />}
            <span className="text-xs text-arctic-secondary tabular-nums">{i + 1}.</span>
            <span className={`text-sm ${t.hecho ? "line-through text-arctic-secondary" : "text-arctic-slate font-medium"}`}>{t.n}</span>
            {t.siguiente && (
              <span className="ml-auto text-xs font-semibold text-glacier-blue bg-glacier-blue/10 px-2 py-0.5 rounded-full">Siguiente</span>
            )}
          </li>
        ))}
      </ol>
    </Marco>
  );
}

/** Método recomendado al iniciar una sesión. */
export function MockMetodo() {
  return (
    <Marco className="border border-cool-iris/20">
      <p className="text-xs font-semibold text-cool-iris">Método sugerido por IA</p>
      <p className="apple-title-3 text-arctic-slate mt-0.5">Active Recall + Práctica espaciada</p>
      <p className="text-sm text-arctic-secondary mt-1">Para repasar límites, recordar sin mirar fija mejor que releer.</p>
      <ol className="mt-3 pt-3 border-t border-black/[0.06] space-y-1.5 text-sm text-arctic-slate">
        {["Cierra el cuaderno y escribe lo que recuerdes", "Resuelve 3 ejercicios sin ver la solución", "Revisa y marca lo que fallaste"].map((p, i) => (
          <li key={p} className="flex gap-2">
            <span className="text-glacier-blue font-bold tabular-nums">{i + 1}.</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </Marco>
  );
}

/** Conversación con el tutor IA. */
export function MockTutor() {
  return (
    <Marco className="space-y-2.5">
      <div className="flex justify-end">
        <p className="max-w-[85%] px-4 py-2.5 text-sm bg-glacier-blue text-white rounded-2xl rounded-br-sm">
          ¿Por qué este límite da 0/0 si reemplazo el valor?
        </p>
      </div>
      <div className="flex justify-start">
        <p className="max-w-[85%] px-4 py-2.5 text-sm bg-black/[0.05] text-arctic-slate rounded-2xl rounded-bl-sm">
          0/0 no es el resultado: es una <strong>indeterminación</strong>. Factoriza el numerador, simplifica y vuelve a reemplazar.
        </p>
      </div>
    </Marco>
  );
}

/** Notas y ponderaciones con la nota necesaria (el simulador interactivo va aparte: SimuladorNota). */
export function MockNotas() {
  return (
    <Marco>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-arctic-secondary">Nota acumulada</p>
          <p className="text-3xl font-bold text-arctic-slate tabular-nums">
            3,8 <span className="text-sm font-normal text-arctic-secondary">/ 5,0</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-arctic-secondary">Para aprobar (3,0)</p>
          <p className="text-3xl font-bold text-arctic-slate tabular-nums">1,8</p>
        </div>
      </div>
      <p className="text-xs text-arctic-secondary mt-1">de promedio en el 40% que falta</p>
      <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-black/[0.06] mt-4">
        <div className="h-full bg-glacier-blue" style={{ width: "60%" }} />
        <div className="h-full bg-glacier-blue/35" style={{ width: "25%" }} />
      </div>
      <div className="flex gap-4 mt-2 text-xs text-arctic-secondary">
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-glacier-blue" />Calificado 60%</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-glacier-blue/35" />Sin nota 25%</span>
      </div>
    </Marco>
  );
}

/** Racha, meta semanal, nivel e insignias. */
export function MockHabitos() {
  const R = 44;
  const C = 2 * Math.PI * R;
  return (
    <Marco>
      <div className="flex items-center justify-between">
        <p className="apple-headline text-arctic-slate">Tu semana</p>
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-arctic-slate">
          <Flame size={15} className="text-cool-berry fill-cool-berry" /> 12 días de racha
        </p>
      </div>
      <div className="flex items-center gap-5 mt-4">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={R} className="stroke-black/[0.06]" strokeWidth="9" fill="none" />
            <circle cx="50" cy="50" r={R} stroke="#0066CC" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray={C} strokeDashoffset={C * 0.25} />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-arctic-slate">75%</span>
            <span className="text-xs text-arctic-secondary">de la meta</span>
          </span>
        </div>
        <p className="text-sm text-arctic-slate">
          <strong>4 h 30 min</strong> de 6 h esta semana
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-black/[0.06] space-y-1.5">
        <p className="text-xs text-arctic-secondary">
          <strong className="text-arctic-slate">Nivel 4</strong> · 620 de 700 XP para el nivel 5
        </p>
        <Barra valor={88} className="bg-cool-iris" />
      </div>
      <div className="flex gap-2 mt-4">
        {[Flame, Zap, Star, Trophy].map((Icono, i) => (
          <span
            key={i}
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${i < 3 ? "bg-glacier-blue text-white" : "bg-black/[0.04] text-arctic-tertiary"}`}
          >
            <Icono size={20} />
          </span>
        ))}
      </div>
    </Marco>
  );
}
