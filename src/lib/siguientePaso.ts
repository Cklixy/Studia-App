import { fechaLocal } from "@/lib/racha";
import { calcularPlanParcial, type PlanParcial } from "@/lib/planParcial";
import { plural } from "@/lib/texto";

// Qué estudiar hoy (auditoría del rediseño, fase 2). Antes se tomaba el primer tema pendiente por
// fecha de creación, ignorando el orden de la ruta y la cercanía de los parciales.
// Ahora: 1) la materia con el parcial más cercano (dentro de URGENCIA_DIAS), 2) si no hay, la
// materia con más avance empezado, y dentro de cada materia el tema según `orden`.

const URGENCIA_DIAS = 21;

type TemaBasico = { id: string; nombre: string; estado: string; orden?: number | null; created_at?: string };
type MateriaBasica = { id: string; nombre: string; fecha_parcial: string | null; temas?: TemaBasico[] | null };

export interface SiguientePaso {
  materiaId: string;
  materiaNombre: string;
  temaId: string;
  temaNombre: string;
  /** Por qué se recomienda este tema, en una frase corta */
  motivo: string;
  plan: PlanParcial | null;
}

function temasPendientesOrdenados(m: MateriaBasica): TemaBasico[] {
  return [...(m.temas || [])]
    .filter((t) => t.estado !== "completado")
    .sort(
      (a, b) => (a.orden ?? 9999) - (b.orden ?? 9999) || String(a.created_at).localeCompare(String(b.created_at))
    );
}

export function calcularSiguientePaso(materias: MateriaBasica[] | null | undefined, hoy: string = fechaLocal()): SiguientePaso | null {
  const candidatas = (materias || [])
    .map((m) => ({ m, pendientes: temasPendientesOrdenados(m), plan: calcularPlanParcial(m, hoy) }))
    .filter((c) => c.pendientes.length > 0);
  if (candidatas.length === 0) return null;

  const conParcial = candidatas
    .filter((c) => c.plan && c.plan.diasRestantes <= URGENCIA_DIAS)
    .sort((a, b) => a.plan!.diasRestantes - b.plan!.diasRestantes);

  const elegida =
    conParcial[0] ??
    // Sin parciales cerca: seguir con lo que ya está empezado (más temas completados) antes que abrir otra materia
    [...candidatas].sort((a, b) => {
      const hechosA = (a.m.temas?.length || 0) - a.pendientes.length;
      const hechosB = (b.m.temas?.length || 0) - b.pendientes.length;
      return hechosB - hechosA;
    })[0];

  const tema = elegida.pendientes[0];
  const plan = elegida.plan;
  let motivo: string;
  if (plan && plan.diasRestantes <= URGENCIA_DIAS) {
    const cuando = plan.diasRestantes === 0 ? "es hoy" : plan.diasRestantes === 1 ? "es mañana" : `en ${plan.diasRestantes} días`;
    motivo = `Parcial ${cuando} · ${plural(elegida.pendientes.length, "tema pendiente", "temas pendientes")}`;
  } else {
    const hechos = (elegida.m.temas?.length || 0) - elegida.pendientes.length;
    motivo =
      hechos > 0
        ? `Sigue donde ibas · ${hechos} de ${elegida.m.temas?.length} temas completados`
        : `Primer tema de ${elegida.m.nombre}`;
  }

  return {
    materiaId: elegida.m.id,
    materiaNombre: elegida.m.nombre,
    temaId: tema.id,
    temaNombre: tema.nombre,
    motivo,
    plan,
  };
}
