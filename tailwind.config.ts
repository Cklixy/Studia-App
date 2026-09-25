import type { Config } from "tailwindcss";

// Sistema de diseño «Cuaderno» (rediseno/02-sistema-de-diseno.md). Los colores son variables CSS
// (canales RGB) definidas en globals.css para claro y oscuro: aquí solo se nombran los roles.
const rol = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: rol("fondo"),
        superficie: rol("superficie"),
        hundido: rol("hundido"),
        linea: rol("linea"),
        "linea-fuerte": rol("linea-fuerte"),
        tinta: rol("tinta"),
        "tinta-2": rol("tinta-2"),
        "tinta-3": rol("tinta-3"),
        acento: rol("acento"),
        "acento-hover": rol("acento-hover"),
        "sobre-acento": rol("sobre-acento"),
        "acento-suave": rol("acento-suave"),
        resaltador: rol("resaltador"),
        "sobre-resaltador": rol("sobre-resaltador"),
        exito: rol("exito"),
        "exito-suave": rol("exito-suave"),
        error: rol("error"),
        "error-suave": rol("error-suave"),
        aviso: rol("aviso"),
        "aviso-suave": rol("aviso-suave"),
        velo: rol("velo"),
      },
      fontFamily: {
        sans: ["var(--fuente-texto)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--fuente-titular)", "Georgia", "serif"],
      },
      // Escala tipográfica: mínimo 13 px (antes 12 px en 306 usos de text-xs)
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.125rem" }],
        sm: ["0.9375rem", { lineHeight: "1.375rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "1.875rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["2.75rem", { lineHeight: "1.05" }],
        "6xl": ["3.5rem", { lineHeight: "1.02" }],
        "7xl": ["4.25rem", { lineHeight: "1" }],
      },
      borderRadius: {
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        1: "var(--sombra-1)",
        2: "var(--sombra-2)",
        3: "var(--sombra-3)",
      },
      transitionDuration: {
        rapida: "120ms",
        media: "200ms",
        lenta: "320ms",
      },
      transitionTimingFunction: {
        salida: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        entrada: "cubic-bezier(0.4, 0, 1, 1)",
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.01em",
        wide: "0.02em",
        wider: "0.04em",
        widest: "0.06em",
      },
    },
  },
  plugins: [],
};
export default config;
