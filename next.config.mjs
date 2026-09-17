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
        ],
      },
    ];
  },
};

export default nextConfig;
