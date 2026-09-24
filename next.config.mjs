/** @type {import('next').NextConfig} */
const nextConfig = {
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
            // M8b: Content-Security-Policy
            // unsafe-inline / unsafe-eval son necesarios para Next.js 14 (RSC chunks, HMR).
            // Un CSP con nonces requeriría cambios más amplios en el proyecto.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
