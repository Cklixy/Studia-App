import { DESCRIPCION_SITIO, NOMBRE_SITIO, URL_SITIO } from "@/lib/sitio";

/**
 * Datos estructurados (JSON-LD) de la home: qué es studia+ para los buscadores.
 * - SoftwareApplication: app educativa web, en español de Colombia, con el plan gratuito.
 *   El plan Pro se añade a `offers` solo cuando se pueda comprar; sin `aggregateRating` mientras
 *   no haya reseñas reales.
 * - Organization y WebSite: nombre, URL y logo de la marca.
 * La pregunta frecuente (FAQPage) se añade en la fase B, junto con la sección visible.
 */
export default function DatosEstructurados() {
  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${URL_SITIO}/#app`,
        name: NOMBRE_SITIO,
        description: DESCRIPCION_SITIO,
        url: `${URL_SITIO}/`,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: "es-CO",
        image: `${URL_SITIO}/opengraph-image`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "COP", name: "Plan gratuito" },
        publisher: { "@id": `${URL_SITIO}/#organizacion` },
      },
      {
        "@type": "Organization",
        "@id": `${URL_SITIO}/#organizacion`,
        name: NOMBRE_SITIO,
        url: `${URL_SITIO}/`,
        logo: `${URL_SITIO}/icons/icon-512x512.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${URL_SITIO}/#sitio`,
        name: NOMBRE_SITIO,
        url: `${URL_SITIO}/`,
        inLanguage: "es-CO",
        publisher: { "@id": `${URL_SITIO}/#organizacion` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // «<» escapado para que ningún texto pueda cerrar la etiqueta <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
