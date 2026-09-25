import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { DESCRIPCION_SITIO, ES_PRODUCCION, NOMBRE_SITIO, URL_SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  // Cada página pone solo su nombre («Iniciar sesión») y la plantilla añade la marca
  title: { default: NOMBRE_SITIO, template: `%s · ${NOMBRE_SITIO}` },
  description: DESCRIPCION_SITIO,
  applicationName: NOMBRE_SITIO,
  manifest: "/manifest.json",
  // Los Preview de Vercel no deben indexarse
  robots: ES_PRODUCCION ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: NOMBRE_SITIO,
    title: NOMBRE_SITIO,
    description: DESCRIPCION_SITIO,
    // La imagen (1200 × 630) sale de app/opengraph-image.tsx y app/twitter-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: NOMBRE_SITIO,
    description: DESCRIPCION_SITIO,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "studia+",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <head>
        <meta name="theme-color" content="#F4F6FB" />
      </head>
      <body className="font-sans antialiased text-arctic-slate bg-frost-base">
        {/* Enlace de salto (WCAG 2.4.1): visible solo al enfocarlo con el teclado */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-3 focus:rounded-xl focus:bg-white focus:text-arctic-slate focus:font-semibold focus:shadow-apple-lg focus:outline focus:outline-2 focus:outline-glacier-blue"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
