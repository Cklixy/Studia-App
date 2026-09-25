import { fechaLocal, restarDias, ZONA_HORARIA } from "@/lib/racha";
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

  // Día y hora en Colombia: la página se renderiza en el servidor (UTC) y antes las horas
  // salían 5 h adelantadas y las sesiones de la noche caían en «mañana».
  const dia = fechaLocal(date);
  const hoy = fechaLocal();
  const timeStr = new Intl.DateTimeFormat("es-CO", {
    timeZone: ZONA_HORARIA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

  if (dia === hoy) {
    return `Hoy · ${timeStr}`;
  }

  if (dia === restarDias(hoy, 1)) {
    return `Ayer · ${timeStr}`;
  }

  // Mes abreviado en español sin punto final (ej: "sept", "oct")
  const [anio, mes, diaMes] = dia.split("-").map(Number);
  const cleanMonth = new Date(Date.UTC(anio, mes - 1, 15))
    .toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" })
    .replace(".", "")
    .toLowerCase();

  if (anio === Number(hoy.slice(0, 4))) {
    return `${diaMes} ${cleanMonth} · ${timeStr}`;
  }

  return `${diaMes} ${cleanMonth} ${anio} · ${timeStr}`;
}
