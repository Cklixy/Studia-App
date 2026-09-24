// Modelo de Gemini para todas las rutas de IA (chat, generar-ruta y recomendación).
// Se fija una versión estable en lugar de un alias "-latest" para que el comportamiento no
// cambie sin aviso. Para cambiarlo sin tocar código, define GEMINI_MODEL en el entorno.
// Modelos vigentes: https://ai.google.dev/gemini-api/docs/models
export const MODELO_GEMINI = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
