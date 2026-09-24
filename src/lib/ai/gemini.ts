// Modelo de Gemini para todas las rutas de IA (chat, generar-ruta y recomendación).
// Se fija una versión estable en lugar de un alias "-latest" para que el comportamiento no
// cambie sin aviso. Para cambiarlo sin tocar código, define GEMINI_MODEL en el entorno.
// Modelos vigentes: https://ai.google.dev/gemini-api/docs/models
export const MODELO_GEMINI = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";

// Modelo de respaldo cuando el principal está saturado (503 "high demand").
export const MODELO_GEMINI_RESPALDO = process.env.GEMINI_MODEL_FALLBACK?.trim() || "gemini-3.5-flash";

// Respuesta estándar para el cliente cuando la IA no está disponible tras los reintentos.
export const RESPUESTA_IA_SATURADA = {
  codigo: "IA_SATURADA",
  error: "La IA está saturada en este momento. Inténtalo de nuevo en unos segundos.",
} as const;

const CODIGOS_REINTENTABLES = new Set([429, 500, 503]);

export function esErrorIaSaturada(error: unknown): boolean {
  const status = (error as { status?: number })?.status;
  return (typeof status === "number" && CODIGOS_REINTENTABLES.has(status)) || (error as Error)?.message === "IA_SATURADA";
}

/**
 * Ejecuta una llamada a Gemini con resiliencia:
 * 1. Modelo principal; si falla con 429/500/503, un reintento tras 1 s.
 * 2. Si sigue fallando, un intento con el modelo de respaldo.
 * Como máximo 3 llamadas, para no alargar demasiado la respuesta.
 * Los errores no reintentables (400, JSON inválido…) se propagan de inmediato.
 */
export async function conReintentoGemini<T>(llamar: (modelo: string) => Promise<T>): Promise<T> {
  const intentos: Array<{ modelo: string; esperaMs: number }> = [
    { modelo: MODELO_GEMINI, esperaMs: 0 },
    { modelo: MODELO_GEMINI, esperaMs: 1000 },
    ...(MODELO_GEMINI_RESPALDO !== MODELO_GEMINI ? [{ modelo: MODELO_GEMINI_RESPALDO, esperaMs: 0 }] : []),
  ];

  let ultimoError: unknown;
  for (const { modelo, esperaMs } of intentos) {
    if (esperaMs) await new Promise((r) => setTimeout(r, esperaMs));
    try {
      return await llamar(modelo);
    } catch (error) {
      if (!esErrorIaSaturada(error)) throw error;
      ultimoError = error;
      console.warn(`[gemini] ${modelo} no disponible (${(error as { status?: number })?.status ?? "?"}), reintentando…`);
    }
  }
  console.error("[gemini] Sin respuesta tras los reintentos:", ultimoError);
  throw Object.assign(new Error("IA_SATURADA"), { status: 503 });
}
