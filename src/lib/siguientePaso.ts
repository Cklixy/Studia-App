import type { PlanParcial } from "@/lib/planParcial";

// «Hoy» (rediseño, principio 2): elige la siguiente mejor acción con los datos que ya existen,
// sin reglas nuevas de negocio. Prioridad: sesión sin terminar → tema del parcial más cercano →
// primer tema pendiente → materia sin temas → primera materia.

type Tema = { id: string; nombre: string; estado: string; orden?: number | null; created_at?: string };
type Materia = { id: string; nombre: string; fecha_parcial: string | null; temas?: Tema[] | null };

export type SiguientePaso =
  | { tipo: "continuar"; sesionId: string; titulo: string; materia: string | null }
  | { tipo: "parcial"; materiaId: string; materia: string; temaId: string; titulo: string; plan: PlanParcial }
  | { tipo: "tema"; materiaId: string; materia: string; temaId: string; titulo: string; posicion: number; total: number }
  | { tipo: "agregar-temas"; materiaId: string; materia: string }
  | { tipo: "todo-listo" }
  | { tipo: "primera-materia" };

const ordenar = (temas: Tema[]) =>
  [...temas].sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999) || String(a.created_at).localeCompare(String(b.created_at)));

export function elegirSiguientePaso(
  materias: Materia[],
  planes: PlanParcial[],
  sesionAbierta: { id: string; materia_id: string | null; tema_id: string | null } | null
): SiguientePaso {
  if (sesionAbierta) {
    const m = materias.find((x) => x.id === sesionAbierta.materia_id);
    const t = m?.temas?.find((x) => x.id === sesionAbierta.tema_id);
    return { tipo: "continuar", sesionId: sesionAbierta.id, titulo: t?.nombre || "Tu sesión de estudio", materia: m?.nombre || null };
  }
  if (materias.length === 0) return { tipo: "primera-materia" };

  const planConTema = planes.find((p) => p.siguienteTema);
  if (planConTema?.siguienteTema) {
    return {
      tipo: "parcial",
      materiaId: planConTema.materiaId,
      materia: planConTema.materiaNombre,
      temaId: planConTema.siguienteTema.id,
      titulo: planConTema.siguienteTema.nombre,
      plan: planConTema,
    };
  }

  for (const m of materias) {
    const temas = ordenar(m.temas || []);
    const i = temas.findIndex((t) => t.estado !== "completado");
    if (i >= 0) return { tipo: "tema", materiaId: m.id, materia: m.nombre, temaId: temas[i].id, titulo: temas[i].nombre, posicion: i + 1, total: temas.length };
  }

  const sinTemas = materias.find((m) => !m.temas?.length);
  if (sinTemas) return { tipo: "agregar-temas", materiaId: sinTemas.id, materia: sinTemas.nombre };
  return { tipo: "todo-listo" };
}

/** Días estudiados de la semana actual (lunes a domingo) a partir de fechas AAAA-MM-DD. */
export function semanaActual(hoy: string, diasEstudiados: Set<string>) {
  const d = new Date(`${hoy}T12:00:00Z`);
  const desdeLunes = (d.getUTCDay() + 6) % 7;
  return ["L", "M", "X", "J", "V", "S", "D"].map((letra, i) => {
    const dia = new Date(d.getTime() + (i - desdeLunes) * 86_400_000).toISOString().slice(0, 10);
    return { letra, fecha: dia, hecho: diasEstudiados.has(dia), esHoy: dia === hoy, futuro: dia > hoy };
  });
}
