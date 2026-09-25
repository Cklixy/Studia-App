"use client";

import { useEffect } from "react";

/**
 * Activa la entrada de las secciones marcadas con `data-revelar` al aparecer en pantalla.
 * Un solo IntersectionObserver para toda la página. Lo que ya está en pantalla al cargar se marca
 * visible antes de activar el efecto, para que nada parpadee; sin JS (o para buscadores) no se
 * oculta nada. Con movimiento reducido el CSS lo desactiva. No dibuja nada.
 */
export default function Revelador() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-revelar]"));
    const alto = window.innerHeight;
    for (const el of elementos) {
      if (el.getBoundingClientRect().top < alto) el.dataset.visible = "";
    }
    document.documentElement.classList.add("revelar-activo");

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.visible = "";
            observador.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    elementos.filter((el) => !("visible" in el.dataset)).forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  return null;
}
