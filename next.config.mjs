/** @type {import('next').NextConfig} */

const esDesarrollo = process.env.NODE_ENV !== "production";

// Origen exacto del proyecto de Supabase (más estricto que *.supabase.co).
let origenSupabase = "https://*.supabase.co";
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    origenSupabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
  }
} catch {
  // URL mal formada: se mantiene el comodín
}
const origenSupabaseWs = origenSupabase.replace(/^https:/, "wss:");

// La barra de comentarios de Vercel solo se inyecta en los despliegues Preview.
// Orígenes según https://vercel.com/docs/vercel-toolbar/managing-toolbar
const esPreview = process.env.VERCEL_ENV === "preview";
const toolbar = (...origenes) => (esPreview ? " " + origenes.join(" ") : "");

// Content-Security-Policy
// - 'unsafe-inline' en script-src sigue siendo necesario: Next.js 14 inyecta scripts inline
//   (payload RSC). Quitarlo exige nonces por petición, lo que vuelve dinámicas todas las
//   páginas (incluida la landing estática). Ver auditoria/03-seguridad.md.
// - 'unsafe-eval' solo en desarrollo (React Refresh / HMR); el build de producción no lo usa.
// - Gemini y web-push se llaman desde el servidor, no necesitan connect-src.
// - worker-src / manifest-src cubren el service worker (/sw.js) y /manifest.json.
const csp = [
  "default-src 'self'",
  // open.spotify.com y embed-cdn.spotifycdn.com: iFrame API y reproductor compacto de Spotify
  // en la sesión activa (el script de open.spotify.com carga el resto desde su CDN)
  `script-src 'self' 'unsafe-inline' https://open.spotify.com https://embed-cdn.spotifycdn.com${esDesarrollo ? " 'unsafe-eval'" : ""}${toolbar("https://vercel.live")}`,
  `style-src 'self' 'unsafe-inline'${toolbar("https://vercel.live")}`,
  `font-src 'self'${toolbar("https://vercel.live", "https://assets.vercel.com")}`,
  `img-src 'self' data: blob:${toolbar("https://vercel.live", "https://vercel.com")}`,
  `connect-src 'self' ${origenSupabase} ${origenSupabaseWs}${toolbar("https://vercel.live", "wss://ws-us3.pusher.com")}`,
  `frame-src 'self' https://open.spotify.com${toolbar("https://vercel.live")}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(esDesarrollo ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig = {
  // No anunciar la tecnología del servidor (cabecera X-Powered-By)
  poweredByHeader: false,
  webpack: (config) => {
    // Suprime la advertencia informativa de serialización de strings grandes en la caché de Webpack
    config.infrastructureLogging = {
      level: "error",
    };
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Serializing big strings/,
      /PackFileCacheStrategy/,
    ];
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // La app no usa cámara, micrófono, ubicación ni pagos
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
      {
        // Audio de estudio: no cambia de contenido sin cambiar de nombre, se puede cachear un año
        source: "/audio/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // El service worker no debe quedarse cacheado: si cambia, el navegador debe verlo
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
