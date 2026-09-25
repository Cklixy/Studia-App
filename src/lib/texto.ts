// Utilidades de texto para la interfaz en español.

/** "1 día", "2 días"; evita errores como "1 días" o "1 sesiones". */
export function plural(n: number, singular: string, pluralForma: string): string {
  return `${n} ${n === 1 ? singular : pluralForma}`;
}

/** Primera letra en mayúscula y el resto intacto ("jueves, 24 de septiembre" → "Jueves, 24 de septiembre"). */
export function capitalizarInicio(texto: string): string {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

/**
 * Formatea una fecha AAAA-MM-DD (p. ej. fecha_parcial) sin correrla de día.
 * `new Date("2026-10-01")` se interpreta como medianoche UTC, que en Colombia (UTC−5) es el 30 de
 * septiembre: la fecha del parcial se mostraba un día antes. Se fija el mediodía UTC y la zona de Bogotá.
 */
export function formatearFechaLocal(fecha: string, opciones: Intl.DateTimeFormatOptions): string {
  return new Date(`${fecha.slice(0, 10)}T12:00:00Z`).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    ...opciones,
  });
}
