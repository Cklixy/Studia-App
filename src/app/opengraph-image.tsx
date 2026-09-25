import { ImageResponse } from "next/og";

// Imagen para compartir el sitio (Open Graph y Twitter): 1200 × 630, generada en el build.
// Antes se compartía el ícono cuadrado de 512 px, que las redes recortaban.
// Tema claro, con los tokens del sistema: fondo frost-base, tarjeta blanca y glacier-blue.

export const alt = "studia+: la app de estudio que te dice qué estudiar hoy y cómo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge: en el runtime de Node, next/og falla al resolver su fuente en rutas con espacios (Windows)
export const runtime = "edge";

const AZUL = "#0066CC";
const TEXTO = "#1D1D1F";
const SECUNDARIO = "#636366";

// Geist, la tipografía de la app (TTF: next/og no admite WOFF2). Sin ella, el titular salía sin negrita.
// Se cargan dentro de la función: al nivel del módulo, el build las evaluaba y registraba errores.
export default async function ImagenOpenGraph() {
  const [geistRegular, geistBold] = await Promise.all([
    fetch(new URL("./fuentes-og/Geist-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("./fuentes-og/Geist-Bold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
  ]);
  const radio = 110;
  const circunferencia = 2 * Math.PI * radio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #F4F6FB 0%, #EAF1FB 100%)",
          fontFamily: "Geist",
        }}
      >
        {/* Texto */}
        <div style={{ display: "flex", flexDirection: "column", width: 620 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700, color: TEXTO }}>
            studia<span style={{ color: AZUL }}>+</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: TEXTO,
            }}
          >
            La app de estudio que te dice qué estudiar hoy y cómo.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, lineHeight: 1.35, color: SECUNDARIO }}>
            Plan hasta el parcial · Técnicas de estudio · Música para concentrarte
          </div>
        </div>

        {/* Tarjeta de enfoque simplificada */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 360,
            padding: "36px 32px 28px",
            background: "#FFFFFF",
            borderRadius: 32,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 20px 48px -12px rgba(0,30,80,0.14)",
          }}
        >
          <div style={{ display: "flex", position: "relative", width: 260, height: 260, alignItems: "center", justifyContent: "center" }}>
            <svg width="260" height="260" viewBox="0 0 260 260" style={{ position: "absolute", top: 0, left: 0 }}>
              <circle cx="130" cy="130" r={radio} stroke="rgba(0,0,0,0.07)" strokeWidth="14" fill="none" />
              <circle
                cx="130"
                cy="130"
                r={radio}
                stroke={AZUL}
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circunferencia}`}
                strokeDashoffset={`${circunferencia * 0.38}`}
                transform="rotate(-90 130 130)"
              />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em", color: TEXTO }}>15:32</div>
              <div style={{ display: "flex", fontSize: 20, color: SECUNDARIO, marginTop: 4 }}>Llevas 09:28</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 48,
                height: 48,
                borderRadius: 14,
                background: AZUL,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Ecualizador (tres barras), el mismo indicador de «sonando» de la app */}
              <svg width="24" height="22" viewBox="0 0 24 22">
                <rect x="1" y="8" width="5" height="14" rx="2.5" fill="#FFFFFF" />
                <rect x="9.5" y="0" width="5" height="22" rx="2.5" fill="#FFFFFF" />
                <rect x="18" y="5" width="5" height="17" rx="2.5" fill="#FFFFFF" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 14 }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: TEXTO }}>Lluvia</div>
              <div style={{ display: "flex", fontSize: 18, color: SECUNDARIO }}>Sonando · Ambiente</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
      ],
    }
  );
}
