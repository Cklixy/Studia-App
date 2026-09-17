/**
 * Utilidades de formato para sesiones de estudio en Studia+
 */

/**
 * Convierte una duración en segundos a una representación humana legible.
 * Ejemplos: "1 h 22 min", "45 min", "2 h 05 min", "0 min"
 */
export function formatHumanDuration(seconds: number): string {
  const totalMinutes = Math.floor((seconds || 0) / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours} h ${paddedMinutes} min`;
}

/**
 * Formatea un número total de minutos con separador de miles.
 * Ejemplo: 2340 -> "2.340"
 */
export function formatMinutesNumber(minutes: number): string {
  return (minutes || 0).toLocaleString("es-ES");
}

/**
 * Formatea la fecha de finalización o inicio de forma natural en español.
 * Ejemplos: "Hoy · 17:23", "Ayer · 18:24", "12 sep · 16:30"
 */
export function formatNaturalDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  
  // Normalizar fechas para comparación de días (medianoche local)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = todayStart.getTime() - targetStart.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  if (diffDays === 0) {
    return `Hoy · ${timeStr}`;
  }

  if (diffDays === 1) {
    return `Ayer · ${timeStr}`;
  }

  // Mes abreviado en español sin punto final (ej: "sep", "oct")
  const rawMonth = date.toLocaleDateString("es-ES", { month: "short" });
  const cleanMonth = rawMonth.replace(".", "").toLowerCase();
  const day = date.getDate();

  if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${cleanMonth} · ${timeStr}`;
  }

  return `${day} ${cleanMonth} ${date.getFullYear()} · ${timeStr}`;
}
