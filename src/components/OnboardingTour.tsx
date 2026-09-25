"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, BookmarkCheck, ChevronLeft, PlayCircle } from "lucide-react";
import Hoja from "@/components/ui/Hoja";
import { fundido, resorte } from "@/lib/movimiento";

const ONBOARDING_KEY = "studia_onboarding_v1_done";

const PASOS = [
  {
    icono: BookOpen,
    titulo: "Empieza por tus materias",
    texto:
      "Crea tus asignaturas con la fecha del parcial y agrega sus temas, o deja que la IA arme la ruta. En «Inicio» verás cada día qué estudiar primero.",
  },
  {
    icono: PlayCircle,
    titulo: "Estudia con un método",
    texto:
      "Toca «Estudiar»: eliges tema y situación, y studia+ te recomienda el método más efectivo. Durante la sesión puedes poner lluvia, lo-fi o tu playlist de Spotify.",
  },
  {
    icono: BookmarkCheck,
    titulo: "Llega preparado al parcial",
    texto:
      "En «Parciales» registras notas y porcentajes; studia+ calcula cuánto necesitas para aprobar y te propone un plan hasta la fecha del examen.",
  },
];

/**
 * Bienvenida para usuarios nuevos: una hoja de 3 pasos (antes, una superposición propia de 5 pasos
 * con emojis). Se muestra una sola vez; cerrarla también cuenta como vista.
 */
export default function OnboardingTour() {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const reducido = useReducedMotion();

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) {
        // Pequeña espera para que la página se vea antes de la bienvenida
        const t = setTimeout(() => setAbierto(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      // Sin localStorage (modo privado): no se muestra
    }
  }, []);

  const cerrar = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {}
    setAbierto(false);
  }, []);

  const ir = (nuevo: number) => {
    setDireccion(nuevo > paso ? 1 : -1);
    setPaso(nuevo);
  };

  const actual = PASOS[paso];
  const Icono = actual.icono;
  const ultimo = paso === PASOS.length - 1;

  return (
    <Hoja abierto={abierto} onCerrar={cerrar} titulo="Bienvenido a studia+" descripcion={`Paso ${paso + 1} de ${PASOS.length}`}>
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direccion} initial={false}>
          <motion.div
            key={paso}
            custom={direccion}
            initial={reducido ? { opacity: 0 } : { opacity: 0, x: 24 * direccion }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducido ? { opacity: 0 } : { opacity: 0, x: -24 * direccion }}
            transition={reducido ? fundido : resorte}
            aria-live="polite"
          >
            <div aria-hidden="true" className="w-12 h-12 rounded-2xl bg-glacier-blue/10 text-glacier-blue flex items-center justify-center mb-4">
              <Icono size={24} />
            </div>
            <h3 className="apple-title-3 text-arctic-slate">{actual.titulo}</h3>
            <p className="text-sm text-arctic-secondary mt-1.5 leading-relaxed">{actual.texto}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-6" aria-hidden="true">
        {PASOS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === paso ? "w-5 bg-glacier-blue" : "w-1.5 bg-black/15"}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2.5 mt-6">
        {paso > 0 ? (
          <button type="button" onClick={() => ir(paso - 1)} className="btn-apple-secondary text-sm min-h-12 px-4 apple-tactile">
            <ChevronLeft size={16} aria-hidden="true" />
            <span>Atrás</span>
          </button>
        ) : (
          <button type="button" onClick={cerrar} className="btn-apple-ghost text-sm min-h-12 px-4 apple-tactile">
            Saltar
          </button>
        )}
        <button
          type="button"
          data-autofocus
          onClick={() => (ultimo ? cerrar() : ir(paso + 1))}
          className="btn-apple-primary text-sm min-h-12 flex-1 apple-tactile"
        >
          <span>{ultimo ? "Empezar" : "Siguiente"}</span>
          {!ultimo && <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </div>
    </Hoja>
  );
}
