// URL pública del sitio, usada en metadatos, robots.txt y sitemap.xml.
export const URL_SITIO = process.env.NEXT_PUBLIC_SITE_URL || "https://studia-app-one.vercel.app";

// Solo el despliegue de producción debe indexarse; los Preview de Vercel y el desarrollo local no.
export const ES_PRODUCCION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

// Rutas que requieren sesión: nunca deben aparecer en buscadores.
export const RUTAS_PRIVADAS = [
  "/materias",
  "/sesion",
  "/evaluaciones",
  "/historial",
  "/logros",
  "/ajustes",
  "/rutas",
  "/api/",
  "/auth/",
  "/nueva-contrasena",
];
