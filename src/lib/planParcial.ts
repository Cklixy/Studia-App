import { fechaLocal } from "@/lib/racha";

// Plan hasta el parcial (auditoría U-11): con la fecha del parcial y los temas pendientes,
// cuántos días quedan y a qué ritmo hay que avanzar, dejando el día anterior para repasar.

export interface PlanParcial {
  materiaId: string;
  materiaNombre: string;
  fechaParcial: string; // AAAA-MM-DD
  diasRestantes: number; // 0 = hoy
  temasPendientes: number;
  temasTotales: number;
  temasPorDia: number; // 0 si no quedan temas
  siguienteTema: { id: string; nombre: string } | null;
  mensaje: string;
}

type TemaBasico = { id: string; nombre: string; estado: string; orden?: number | null; created_at?: string };
type MateriaBasica = { id: string; nombre: string; fecha_parcial: string | null; temas?: TemaBasico[] | null };

function diasEntre(desde: string, hasta: string): number {
  const a = Date.parse(`${desde}T00:00:00Z`);
  const b = Date.parse(`${hasta}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function calcularPlanParcial(materia: MateriaBasica, hoy: string = fechaLocal()): PlanParcial | null {
  if (!materia.fecha_parcial) return null;
  const fecha = materia.fecha_parcial.slice(0, 10);
  const diasRestantes = diasEntre(hoy, fecha);
  if (diasRestantes < 0) return null; // el parcial ya pasó

  const temas = [...(materia.temas || [])].sort(
    (a, b) => (a.orden ?? 9999) - (b.orden ?? 9999) || String(a.created_at).localeCompare(String(b.created_at))
  );
  const pendientes = temas.filter((t) => t.estado !== "completado");
  // Días de estudio: hasta el día anterior al parcial, que se reserva para repasar
  const diasDeEstudio = Math.max(1, diasRestantes - 1);
  const temasPorDia = pendientes.length ? Math.ceil(pendientes.length / diasDeEstudio) : 0;
  const cuando = diasRestantes === 0 ? "El parcial es hoy" : diasRestantes === 1 ? "El parcial es mañana" : `Faltan ${diasRestantes} días`;

  let mensaje: string;
  if (temas.length === 0) mensaje = `${cuando}. Agrega los temas que entran para armar tu plan.`;
  else if (pendientes.length === 0) mensaje = `${cuando}. Ya completaste todos los temas: dedica el tiempo a repasar y practicar.`;
  else if (diasRestantes <= 1) mensaje = `${cuando}. Repasa lo esencial de ${pendientes.length === 1 ? "el tema pendiente" : `los ${pendientes.length} temas pendientes`}.`;
  else
    mensaje = `${cuando}. Te ${pendientes.length === 1 ? "queda 1 tema" : `quedan ${pendientes.length} temas`}: ${temasPorDia === 1 ? "1 tema por día" : `unos ${temasPorDia} temas por día`} y el día anterior para repasar.`;

  return {
    materiaId: materia.id,
    materiaNombre: materia.nombre,
    fechaParcial: fecha,
    diasRestantes,
    temasPendientes: pendientes.length,
    temasTotales: temas.length,
    temasPorDia,
    siguienteTema: pendientes[0] ? { id: pendientes[0].id, nombre: pendientes[0].nombre } : null,
    mensaje,
  };
}

/** Planes de los parciales próximos (dentro de `horizonteDias`), del más cercano al más lejano. */
export function planesProximos(materias: MateriaBasica[] | null | undefined, horizonteDias = 45): PlanParcial[] {
  const hoy = fechaLocal();
  return (materias || [])
    .map((m) => calcularPlanParcial(m, hoy))
    .filter((p): p is PlanParcial => !!p && p.diasRestantes <= horizonteDias)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}
