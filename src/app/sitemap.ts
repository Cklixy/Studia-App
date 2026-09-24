import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";

// Solo páginas públicas; las privadas están excluidas en robots.ts y llevan noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${URL_SITIO}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${URL_SITIO}/registro`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${URL_SITIO}/login`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
