"use client";

import { Children } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DESPLAZAMIENTO_ENTRADA, ESCALONADO_S, fundido, resorte } from "@/lib/movimiento";

interface ListaEscalonadaProps {
  children: React.ReactNode;
  /** Clases del contenedor (p. ej. la rejilla) */
  className?: string;
  /** Clases de cada elemento envoltorio */
  classNameElemento?: string;
}

/**
 * Hace entrar a los hijos uno tras otro (30 ms entre cada uno) con el resorte de la casa.
 * Cada hijo va envuelto en un div: si el hijo debe ocupar toda la celda de la rejilla, pasa
 * `classNameElemento="h-full"` o similar.
 */
export default function ListaEscalonada({ children, className, classNameElemento }: ListaEscalonadaProps) {
  const reducido = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="oculto"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reducido ? 0 : ESCALONADO_S } } }}
    >
      {Children.map(children, (hijo) =>
        hijo == null ? null : (
          <motion.div
            className={classNameElemento}
            variants={{
              oculto: { opacity: 0, y: reducido ? 0 : DESPLAZAMIENTO_ENTRADA },
              visible: { opacity: 1, y: 0, transition: reducido ? fundido : resorte },
            }}
          >
            {hijo}
          </motion.div>
        )
      )}
    </motion.div>
  );
}
