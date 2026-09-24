import type { MetadataRoute } from "next";
import { ES_PRODUCCION, RUTAS_PRIVADAS, URL_SITIO } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  if (!ES_PRODUCCION) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: RUTAS_PRIVADAS,
    },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
