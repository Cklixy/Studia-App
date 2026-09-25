"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHaySesion } from "@/hooks/useHaySesion";
import { CTA_CON_SESION, CTA_PRINCIPAL } from "@/lib/landing";

// Piezas interactivas de la landing (fase C). Pequeñas y aisladas: el resto de la página es de servidor.

const fmt = (n: number, d = 2) => n.toFixed(d).replace(".", ",");

/** Movimiento reducido sin cargar la librería de animación en la landing. */
function usePrefiereMenosMovimiento() {
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);
  return reducido;
}

/**
 * Anillo del mockup de la tarjeta de enfoque que avanza de verdad (un segundo por segundo) mientras
 * está en pantalla. Con movimiento reducido queda quieto en su valor inicial.
 */
export function AnilloVivo() {
  const TOTAL = 25 * 60;
  const [restante, setRestante] = useState(15 * 60 + 32);
  const reducido = usePrefiereMenosMovimiento();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducido || !ref.current) return;
    let intervalo: ReturnType<typeof setInterval> | null = null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !intervalo) {
        intervalo = setInterval(() => setRestante((r) => (r <= 0 ? TOTAL : r - 1)), 1000);
      } else if (!e.isIntersecting && intervalo) {
        clearInterval(intervalo);
        intervalo = null;
      }
    });
    obs.observe(ref.current);
    return () => {
      obs.disconnect();
      if (intervalo) clearInterval(intervalo);
    };
  }, [reducido, TOTAL]);

  const R = 100;
  const C = 2 * Math.PI * R;
  const transcurrido = TOTAL - restante;
  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div ref={ref} className="relative w-56 h-56 mx-auto my-5">
      <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
        <circle cx="120" cy="120" r={R} className="stroke-black/[0.06]" strokeWidth="12" fill="none" />
        <circle
          cx="120"
          cy="120"
          r={R}
          stroke="#0066CC"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - transcurrido / TOTAL)}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-medium tracking-[-0.04em] text-arctic-slate tabular-nums">{mmss(restante)}</span>
        <span className="text-sm text-arctic-secondary mt-1.5 tabular-nums">Llevas {mmss(transcurrido)}</span>
      </div>
    </div>
  );
}

/**
 * Demo del simulador «¿Y si saco…?» con los mismos cálculos de la app: 3,8 sobre el 60 % calificado
 * (aporta 2,28) y el 40 % restante con la nota que elija el visitante. Es un control real y accesible.
 */
export function SimuladorNota() {
  const [nota, setNota] = useState(3.5);
  const id = useId();
  const APORTADO = 3.8 * 0.6;
  const RESTANTE = 0.4;
  const final = APORTADO + nota * RESTANTE;
  const aprueba = final >= 3;

  return (
    <div className="apple-card p-5 sm:p-6">
      <label htmlFor={id} className="block text-sm font-semibold text-arctic-slate">
        Pruébalo: ¿y si saco…?
      </label>
      <p className="text-xs text-arctic-secondary mt-0.5">Llevas 3,8 en el 60% calificado. Mueve la nota que esperas en el 40% que falta.</p>
      <div className="flex items-center gap-4 mt-3">
        <input
          id={id}
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
          aria-valuetext={`${fmt(nota, 1)}: nota final ${fmt(final)}`}
          className="flex-1 accent-glacier-blue h-11"
        />
        <span className="text-2xl font-bold text-arctic-slate tabular-nums w-12 text-right">{fmt(nota, 1)}</span>
      </div>
      <p className="text-sm text-arctic-slate mt-1" aria-live="polite">
        Nota final: <strong className="tabular-nums">{fmt(final)}</strong> ·{" "}
        <span className={aprueba ? "text-emerald-700 font-semibold" : "text-cool-berry font-semibold"}>
          {aprueba ? "apruebas" : "no alcanza"}
        </span>
      </p>
    </div>
  );
}

/**
 * Barra inferior fija en móvil con la acción principal: aparece al pasar el hero y se oculta al
 * llegar al CTA final (para no repetirlo). Es fija, así que no desplaza contenido (sin CLS).
 */
export function CtaMovilFijo() {
  const haySesion = useHaySesion();
  const [visible, setVisible] = useState(false);
  const barraRef = useRef<HTMLDivElement>(null);

  // Oculta = fuera del orden de tabulación y de los lectores de pantalla
  useEffect(() => {
    if (barraRef.current) barraRef.current.inert = !visible;
  }, [visible]);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const final = document.getElementById("cta-final");
    if (!hero || !final || !("IntersectionObserver" in window)) return;
    const estado = { heroVisible: true, finalVisible: false };
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === hero) estado.heroVisible = e.isIntersecting;
        if (e.target === final) estado.finalVisible = e.isIntersecting;
      }
      setVisible(!estado.heroVisible && !estado.finalVisible);
    });
    obs.observe(hero);
    obs.observe(final);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={barraRef}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 apple-glass-ultra border-t border-black/[0.06] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <Link href={haySesion ? "/materias" : "/registro"} className="btn-apple-primary w-full min-h-12 text-base apple-tactile">
        <span>{haySesion ? CTA_CON_SESION : CTA_PRINCIPAL}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  );
}
