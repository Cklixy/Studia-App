// Utilidades de texto para la interfaz en español.

/** "1 día", "2 días"; evita errores como "1 días" o "1 sesiones". */
export function plural(n: number, singular: string, pluralForma: string): string {
  return `${n} ${n === 1 ? singular : pluralForma}`;
}

/** Primera letra en mayúscula y el resto intacto ("jueves, 24 de septiembre" → "Jueves, 24 de septiembre"). */
export function capitalizarInicio(texto: string): string {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}
