import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { ES_PRODUCCION, URL_SITIO } from "@/lib/sitio";

// Dos familias (sistema «Cuaderno»): Fraunces solo en peso 600 para titulares y cifras grandes,
// Figtree variable para la interfaz. Subconjunto latino para no superar el peso de fuentes anterior.
const fuenteTitular = Fraunces({ subsets: ["latin"], weight: ["600"], variable: "--fuente-titular", display: "swap" });
const fuenteTexto = Figtree({ subsets: ["latin"], variable: "--fuente-texto", display: "swap" });

// Aplica el tema elegido en Ajustes antes de pintar (sin destello). «sistema» = prefers-color-scheme.
const scriptTema = `try{var t=localStorage.getItem("studia-tema");if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t}catch(e){}`;

const descripcion = "Organiza tus materias, sabe qué estudiar hoy y llega preparado a tus parciales.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#14161B" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: "studia+",
  description: descripcion,
  manifest: "/manifest.json",
  // Los Preview de Vercel no deben indexarse
  robots: ES_PRODUCCION ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "studia+",
    title: "studia+",
    description: descripcion,
    images: [{ url: "/icons/icon-512x512.png", width: 512, height: 512, alt: "studia+" }],
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
    <html lang="es" className={`${fuenteTitular.variable} ${fuenteTexto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="font-sans antialiased text-tinta bg-fondo">
        {/* Enlace de salto (WCAG 2.4.1): visible solo al enfocarlo con el teclado */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-3 focus:rounded-xl focus:bg-superficie focus:text-tinta focus:font-semibold focus:shadow-3 focus:outline focus:outline-2 focus:outline-acento"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
