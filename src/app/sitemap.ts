import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";

// Solo páginas públicas; las privadas están excluidas en robots.ts y llevan noindex.
// Fecha de la última actualización del contenido público (se cambia al publicar cambios en la landing)
const ACTUALIZADO = new Date("2026-09-25");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${URL_SITIO}/`, lastModified: ACTUALIZADO, changeFrequency: "monthly", priority: 1 },
    { url: `${URL_SITIO}/registro`, lastModified: ACTUALIZADO, changeFrequency: "yearly", priority: 0.6 },
    { url: `${URL_SITIO}/login`, lastModified: ACTUALIZADO, changeFrequency: "yearly", priority: 0.4 },
  ];
}
