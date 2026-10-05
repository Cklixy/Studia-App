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
  "/planes",
  "/api/",
  "/auth/",
  "/nueva-contrasena",
];

// Textos de SEO (plan de la landing, fase A). El título de la home lleva las búsquedas objetivo
// («app de estudio», «técnicas de estudio»); ~60 caracteres y la descripción ~155, lo que Google muestra.
export const NOMBRE_SITIO = "studia+";
export const TITULO_HOME = "studia+ · App de estudio con plan, técnicas de estudio e IA";
export const DESCRIPCION_SITIO =
  "Organiza tus materias, sigue un plan hasta el parcial y estudia con técnicas como Active Recall y Pomodoro. Música para concentrarte y tutor con IA. Gratis.";

// Correo de contacto para privacidad y derechos de los titulares (Ley 1581 de 2012). Se define en
// Vercel con NEXT_PUBLIC_CONTACT_EMAIL; si falta, la política de privacidad no muestra ninguno.
export const CORREO_CONTACTO = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
