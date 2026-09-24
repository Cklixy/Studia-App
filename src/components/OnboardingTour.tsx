"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ArrowRight, ChevronLeft, Sparkles, BookOpen, PlayCircle, MapPin, BookmarkCheck } from "lucide-react";

const ONBOARDING_KEY = "studia_onboarding_v1_done";

interface TourStep {
  id: string;
  emoji: string;
  title: string;
  description: string;
  hint?: string;
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    emoji: "👋",
    title: "Bienvenido a studia+",
    description:
      "Tu asistente de estudio inteligente. En menos de 2 minutos te mostramos todo lo que puedes hacer para estudiar con dirección.",
    hint: "Avanza con «Siguiente» o, en computador, con las flechas ← → del teclado.",
  },
  {
    id: "materias",
    emoji: "📚",
    title: "Organiza tus materias",
    description:
      "Crea tus asignaturas y agrega los temas que necesitas estudiar. Studia+ los recordará y te ayudará a organizarlos.",
    hint: "Toca el ícono de brújula 🧭 en el dock inferior.",
  },
  {
    id: "sesion",
    emoji: "🚀",
    title: "Inicia una sesión de estudio",
    description:
      "Cuando quieras estudiar, toca «Estudiar». La IA analizará tu contexto y te recomendará el método cognitivo más efectivo: Active Recall, Pomodoro, Feynman...",
    hint: "Busca el ícono ▶ con el punto azul pulsante en el dock.",
  },
  {
    id: "rutas",
    emoji: "🗺️",
    title: "Tu Plan IA personalizado",
    description:
      "En «Plan IA» generamos una ruta de estudio completa adaptada a tu nivel, materia y tiempo disponible. La IA hace el trabajo por ti.",
    hint: "Toca el ícono ✨ en el dock.",
  },
  {
    id: "evaluaciones",
    emoji: "📝",
    title: "Controla tus notas",
    description:
      "En Evaluaciones registras tus parciales, talleres y quizzes. Studia+ calcula automáticamente cuánto necesitas para aprobar cada materia.",
    hint: "¡Ya estás listo para comenzar! 🎉",
  },
];

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Mostrar el tour solo si el usuario no lo ha completado
  useEffect(() => {
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) {
        // Pequeño delay para que la página cargue primero
        const timer = setTimeout(() => setShow(true), 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage no disponible (SSR, modo privado) → no mostrar
    }
  }, []);

  const dismiss = useCallback((completed = false) => {
    try {
      if (completed) {
        localStorage.setItem(ONBOARDING_KEY, "true");
      }
    } catch {}
    setShow(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss(true);
    }
  }, [step, dismiss]);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  // Navegación por teclado
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [show, dismiss, handleNext, handlePrev]);

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const cardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 28, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.98 },
      };

  const stepVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, x: 18 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -18 },
      };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="onboarding-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[6px]"
            onClick={() => dismiss(false)}
            aria-hidden="true"
          />

          {/* Modal principal */}
          <motion.div
            key="onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Tutorial de bienvenida, paso ${step + 1} de ${STEPS.length}: ${current.title}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", damping: 26, stiffness: 320 }
            }
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto">
              <div className="apple-card p-6 sm:p-8 shadow-[0_32px_80px_-8px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.06)] border border-black/[0.07] relative overflow-hidden">

                {/* Luces ambientales decorativas */}
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 bg-glacier-blue/[0.07] rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-16 -left-16 w-48 h-48 bg-cool-iris/[0.05] rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Botón cerrar */}
                <button
                  onClick={() => dismiss(false)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/[0.05] hover:bg-black/[0.09] flex items-center justify-center text-arctic-secondary hover:text-arctic-slate transition-colors apple-tactile z-10"
                  aria-label="Cerrar tutorial"
                >
                  <X size={14} />
                </button>

                {/* Barra de progreso (pr-12: deja sitio al botón cerrar para que no se solapen) */}
                <div className="mb-6 relative z-10 pr-12">
                  <div
                    className="h-1 bg-black/[0.06] rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={step + 1}
                    aria-valuemin={1}
                    aria-valuemax={STEPS.length}
                    aria-label={`Progreso: paso ${step + 1} de ${STEPS.length}`}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-glacier-blue to-cool-iris rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={
                        shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }
                      }
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-semibold text-arctic-tertiary uppercase tracking-wider">
                      Paso {step + 1} de {STEPS.length}
                    </span>
                    <button
                      onClick={() => dismiss(false)}
                      className="text-[11px] font-medium text-arctic-slate/80 hover:text-arctic-slate transition-colors min-h-6 px-2 -mr-2 inline-flex items-center"
                    >
                      Saltar tour →
                    </button>
                  </div>
                </div>

                {/* Contenido del paso con animación */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: "easeOut" }
                    }
                    className="space-y-5 relative z-10"
                  >
                    {/* Emoji principal */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-glacier-blue/10 via-frost-base to-cool-iris/10 border border-black/[0.06] flex items-center justify-center shadow-apple-sm shrink-0">
                        <span className="text-3xl" role="img" aria-hidden="true">
                          {current.emoji}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-arctic-slate tracking-tight leading-tight">
                        {current.title}
                      </h2>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-arctic-tertiary leading-relaxed">
                      {current.description}
                    </p>

                    {/* Pista contextual */}
                    {current.hint && (
                      <div className="flex items-start gap-2.5 bg-glacier-blue/[0.06] border border-glacier-blue/[0.18] rounded-xl px-3.5 py-3">
                        <MapPin size={13} className="text-glacier-blue shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-xs font-medium text-glacier-blue leading-relaxed">
                          {current.hint}
                        </span>
                      </div>
                    )}

                    {/* Botones de navegación */}
                    <div className="flex items-center gap-2.5 pt-1">
                      {step > 0 && (
                        <button
                          onClick={handlePrev}
                          className="btn-apple-ghost text-xs py-2.5 px-4 apple-tactile inline-flex items-center gap-1.5 shrink-0"
                          aria-label="Ir al paso anterior"
                        >
                          <ChevronLeft size={13} aria-hidden="true" />
                          Atrás
                        </button>
                      )}

                      <button
                        onClick={handleNext}
                        className="btn-apple-primary flex-1 text-xs py-3 px-5 font-semibold apple-tactile shadow-apple-sm inline-flex items-center justify-center gap-2"
                        // El nombre accesible debe contener el texto visible (WCAG 2.5.3)
                        aria-label={isLast ? "¡Comenzar! Finalizar tutorial" : `Siguiente: paso ${step + 2} de ${STEPS.length}`}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                      >
                        <span>{isLast ? "¡Comenzar!" : "Siguiente"}</span>
                        {isLast ? (
                          <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
                        ) : (
                          <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    {/* Dots de navegación */}
                    <div
                      className="flex justify-center gap-0.5 pt-1"
                      role="tablist"
                      aria-label="Pasos del tutorial"
                    >
                      {STEPS.map((s, i) => (
                        <button
                          key={s.id}
                          role="tab"
                          aria-selected={i === step}
                          aria-label={`Ir al paso ${i + 1}: ${s.title}`}
                          onClick={() => setStep(i)}
                          // Área táctil de 24 px (WCAG 2.5.8); el punto visible sigue siendo pequeño
                          className="group h-6 min-w-6 flex items-center justify-center apple-tactile"
                        >
                          <span
                            aria-hidden="true"
                            className={`block rounded-full transition-all duration-300 ${
                              i === step
                                ? "w-5 h-1.5 bg-glacier-blue"
                                : "w-1.5 h-1.5 bg-black/[0.14] group-hover:bg-black/[0.24]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
