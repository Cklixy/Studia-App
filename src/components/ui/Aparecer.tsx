"use client";

import { motion, useReducedMotion } from "motion/react";
import { DESPLAZAMIENTO_ENTRADA, fundido, resorte } from "@/lib/movimiento";

interface AparecerProps {
  children: React.ReactNode;
  className?: string;
  /** Retraso en segundos, para encadenar con otros elementos */
  retraso?: number;
}

/**
 * Entrada suave: sube unos píxeles con el resorte de la casa y se hace visible.
 * Con movimiento reducido solo hay un fundido corto.
 */
export default function Aparecer({ children, className, retraso = 0 }: AparecerProps) {
  const reducido = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducido ? 0 : DESPLAZAMIENTO_ENTRADA }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...(reducido ? fundido : resorte), delay: retraso }}
    >
      {children}
    </motion.div>
  );
}
