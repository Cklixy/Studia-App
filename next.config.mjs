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

// Content-Security-Policy
// - 'unsafe-inline' en script-src sigue siendo necesario: Next.js 14 inyecta scripts inline
//   (payload RSC). Quitarlo exige nonces por petición, lo que vuelve dinámicas todas las
//   páginas (incluida la landing estática). Ver auditoria/03-seguridad.md.
// - 'unsafe-eval' solo en desarrollo (React Refresh / HMR); el build de producción no lo usa.
// - Gemini y web-push se llaman desde el servidor, no necesitan connect-src.
// - worker-src / manifest-src cubren el service worker (/sw.js) y /manifest.json.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  `connect-src 'self' ${origenSupabase} ${origenSupabaseWs}`,
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
        // El service worker no debe quedarse cacheado: si cambia, el navegador debe verlo
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
