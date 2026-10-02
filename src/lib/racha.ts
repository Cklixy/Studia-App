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
export function calcularNuevaRacha(ultimaActividad: string | null | undefined, diasPrevios: number, protegido = false): number {
  const hoy = fechaLocal();
  const ultima = soloFecha(ultimaActividad);
  if (!ultima) return 1;
  if (ultima === hoy) return Math.max(diasPrevios, 1); // ya había estudiado hoy
  if (ultima === restarDias(hoy, 1)) return diasPrevios + 1; // mantuvo la racha
  return protegido ? diasPrevios + 1 : 1; // con protectores se salvó; si no, la racha se había roto
}

/** Días completos sin estudiar entre la última actividad y hoy (0 si fue hoy o ayer). */
export function diasPerdidos(ultimaActividad: string | null | undefined): number {
  const ultima = soloFecha(ultimaActividad);
  if (!ultima) return 0;
  const hoy = fechaLocal();
  return Math.max(0, Math.round((Date.parse(`${hoy}T00:00:00Z`) - Date.parse(`${ultima}T00:00:00Z`)) / 86_400_000) - 1);
}

/**
 * Racha que se debe mostrar: la guardada solo sigue vigente si la última actividad fue hoy o ayer.
 * Antes se mostraba rachas.dias tal cual, aunque la racha llevara días rota.
 */
export function rachaVigente(
  racha: { dias?: number | null; ultima_actividad?: string | null } | null | undefined,
  protectoresDisponibles = 0
): number {
  if (!racha?.dias) return 0;
  if (!soloFecha(racha.ultima_actividad)) return 0;
  // Sigue viva si no se perdió ningún día o si los protectores del mes alcanzan para cubrirlos
  return diasPerdidos(racha.ultima_actividad) <= protectoresDisponibles ? racha.dias : 0;
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

/**
 * Inicio de la semana (lunes 00:00, hora de Colombia) como ISO UTC.
 * Antes el dashboard usaba el domingo en la zona del servidor (UTC), así que la semana
 * empezaba el sábado a las 19:00 en Colombia.
 */
export function inicioSemanaLocal(fecha: Date = new Date()): string {
  const hoy = fechaLocal(fecha);
  const diaSemana = new Date(`${hoy}T12:00:00Z`).getUTCDay(); // 0 = domingo
  const lunes = restarDias(hoy, (diaSemana + 6) % 7);
  return `${lunes}T05:00:00.000Z`; // Colombia es UTC−5 todo el año
}

// --- Semana y tiempo restante (pantalla de racha) ---

export type EstadoDia = "hecho" | "protegido" | "hoy" | "perdido" | "futuro";
export interface DiaSemana {
  fecha: string;
  letra: string;
  nombre: string;
  estado: EstadoDia;
}

const DIAS_SEMANA: [string, string][] = [
  ["L", "lunes"],
  ["M", "martes"],
  ["M", "miércoles"],
  ["J", "jueves"],
  ["V", "viernes"],
  ["S", "sábado"],
  ["D", "domingo"],
];

/** Fechas locales (AAAA-MM-DD) en que hubo actividad, a partir de timestamps ISO. */
export function fechasDeActividad(timestamps: (string | null | undefined)[]): Set<string> {
  const fechas = new Set<string>();
  for (const t of timestamps) if (t) fechas.add(fechaLocal(new Date(t)));
  return fechas;
}

/** Los siete días de la semana actual (lunes a domingo, hora de Colombia) con su estado. */
export function diasDeLaSemana(estudiados: Set<string>, hoy: string = fechaLocal(), protegidos: Set<string> = new Set()): DiaSemana[] {
  const diaSemana = new Date(`${hoy}T12:00:00Z`).getUTCDay(); // 0 = domingo
  const lunes = restarDias(hoy, (diaSemana + 6) % 7);
  return DIAS_SEMANA.map(([letra, nombre], i) => {
    const fecha = restarDias(lunes, -i);
    const estado: EstadoDia = estudiados.has(fecha)
      ? "hecho"
      : protegidos.has(fecha)
        ? "protegido"
        : fecha === hoy
          ? "hoy"
          : fecha < hoy
            ? "perdido"
            : "futuro";
    return { fecha, letra, nombre, estado };
  });
}

/** Minutos que faltan para que termine el día en Colombia (la racha se decide a medianoche). */
export function minutosRestantesHoy(ahora: Date = new Date()): number {
  const partes = new Intl.DateTimeFormat("en-GB", { timeZone: ZONA_HORARIA, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(ahora);
  const hora = Number(partes.find((p) => p.type === "hour")?.value);
  const minuto = Number(partes.find((p) => p.type === "minute")?.value);
  return 24 * 60 - (hora * 60 + minuto);
}

// --- Calendario mensual y mejor racha ---

/** Racha más larga que aparece en un conjunto de fechas AAAA-MM-DD (días consecutivos). */
export function mejorRacha(estudiados: Set<string>): number {
  const fechas = Array.from(estudiados).sort();
  let mejor = 0;
  let actual = 0;
  let previa: string | null = null;
  for (const f of fechas) {
    actual = previa && restarDias(f, 1) === previa ? actual + 1 : 1;
    mejor = Math.max(mejor, actual);
    previa = f;
  }
  return mejor;
}

export interface CeldaMes {
  fecha: string;
  dia: number;
  estado: EstadoDia;
}

/** Mes AAAA-MM válido (si no, el actual). */
export function mesValido(mes: string | undefined, hoy: string = fechaLocal()): string {
  return mes && /^\d{4}-(0[1-9]|1[0-2])$/.test(mes) && mes <= hoy.slice(0, 7) ? mes : hoy.slice(0, 7);
}

/** Mes anterior o siguiente de un AAAA-MM. */
export function moverMes(mes: string, delta: number): string {
  const [a, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(a, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Semanas (lunes a domingo) del mes; las celdas fuera del mes son null. */
export function semanasDelMes(mes: string, estudiados: Set<string>, hoy: string = fechaLocal(), protegidos: Set<string> = new Set()): (CeldaMes | null)[][] {
  const [a, m] = mes.split("-").map(Number);
  const diasMes = new Date(Date.UTC(a, m, 0)).getUTCDate();
  const primero = new Date(Date.UTC(a, m - 1, 1)).getUTCDay(); // 0 = domingo
  const celdas: (CeldaMes | null)[] = Array((primero + 6) % 7).fill(null);
  for (let dia = 1; dia <= diasMes; dia++) {
    const fecha = `${mes}-${String(dia).padStart(2, "0")}`;
    const estado: EstadoDia = estudiados.has(fecha) ? "hecho" : protegidos.has(fecha) ? "protegido" : fecha === hoy ? "hoy" : fecha < hoy ? "perdido" : "futuro";
    celdas.push({ fecha, dia, estado });
  }
  while (celdas.length % 7 !== 0) celdas.push(null);
  const semanas: (CeldaMes | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}
