// Lógica de racha, XP y niveles, en hora de Colombia.
// Antes el "hoy" se calculaba en el servidor (UTC): en Colombia el día cambiaba a las 19:00,
// justo en la franja habitual de estudio, y una sesión a las 20:00 contaba para "mañana".

export const ZONA_HORARIA = "America/Bogota";

/** Fecha (YYYY-MM-DD) en hora de Colombia. */
export function fechaLocal(fecha: Date = new Date()): string {
  // en-CA formatea como AAAA-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}

/** Resta días a una fecha AAAA-MM-DD sin depender de la zona del servidor. */
export function restarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - dias);
  return d.toISOString().slice(0, 10);
}

/** Normaliza lo que devuelva la columna ultima_actividad (date o timestamp) a AAAA-MM-DD. */
export function soloFecha(valor: string | null | undefined): string | null {
  if (!valor) return null;
  return /^\d{4}-\d{2}-\d{2}/.test(valor) ? valor.slice(0, 10) : fechaLocal(new Date(valor));
}

/** Días de racha tras registrar una sesión hoy. */
export function calcularNuevaRacha(ultimaActividad: string | null | undefined, diasPrevios: number): number {
  const hoy = fechaLocal();
  const ultima = soloFecha(ultimaActividad);
  if (!ultima) return 1;
  if (ultima === hoy) return Math.max(diasPrevios, 1); // ya había estudiado hoy
  if (ultima === restarDias(hoy, 1)) return diasPrevios + 1; // mantuvo la racha
  return 1; // la racha se había roto
}

/**
 * Racha que se debe mostrar: la guardada solo sigue vigente si la última actividad fue hoy o ayer.
 * Antes se mostraba rachas.dias tal cual, aunque la racha llevara días rota.
 */
export function rachaVigente(racha: { dias?: number | null; ultima_actividad?: string | null } | null | undefined): number {
  if (!racha?.dias) return 0;
  const ultima = soloFecha(racha.ultima_actividad);
  if (!ultima) return 0;
  const hoy = fechaLocal();
  return ultima === hoy || ultima === restarDias(hoy, 1) ? racha.dias : 0;
}

/** true si hoy ya hubo sesión (la racha está asegurada por hoy). */
export function estudioHoy(racha: { ultima_actividad?: string | null } | null | undefined): boolean {
  return soloFecha(racha?.ultima_actividad) === fechaLocal();
}

// XP y niveles: 10 XP por minuto efectivo; nivel = ⌊√(XP/100)⌋ + 1
export const XP_POR_MINUTO = 10;

export function nivelDesdeXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

/** XP necesario para empezar un nivel (nivel 1 = 0, 2 = 100, 3 = 400, 4 = 900…). */
export function xpInicioNivel(nivel: number): number {
  return Math.pow(Math.max(1, nivel) - 1, 2) * 100;
}
