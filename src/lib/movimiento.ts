import type { Transition } from "motion/react";

// Resortes de la casa (skill apple-design §4): críticamente amortiguados por defecto, sin rebote.
// El rebote se reserva a lo que el usuario lanza con un gesto (hojas que se arrastran).

/** Por defecto para todo lo que aparece, se mueve o cambia de tamaño. */
export const resorte: Transition = { type: "spring", bounce: 0, duration: 0.4 };

/** Hojas y paneles que se arrastran: un poco de rebote porque el gesto trae impulso. */
export const resorteHoja: Transition = { type: "spring", bounce: 0.15, duration: 0.3 };

/** Equivalente con movimiento reducido: un fundido corto, sin desplazamiento (§14). */
export const fundido: Transition = { duration: 0.2, ease: "easeOut" };

/** Separación entre elementos de una lista que entra escalonada. */
export const ESCALONADO_S = 0.03;

/** Distancia (px) que recorre un elemento al aparecer. */
export const DESPLAZAMIENTO_ENTRADA = 8;
