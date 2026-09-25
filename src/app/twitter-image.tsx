import ImagenOpenGraph from "./opengraph-image";

// La tarjeta de Twitter/X usa la misma imagen que Open Graph. Los valores se declaran aquí de forma
// literal porque Next.js los lee de manera estática en cada archivo de imagen.
export const alt = "studia+: la app de estudio que te dice qué estudiar hoy y cómo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge: en el runtime de Node, next/og falla al resolver su fuente en rutas con espacios (Windows)
export const runtime = "edge";

export default ImagenOpenGraph;
