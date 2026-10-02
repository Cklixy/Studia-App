import { Crown, Flame, Gem, Star, Trophy, Zap, type LucideIcon } from "lucide-react";

// Insignias de racha. Íconos en lugar de emojis: se ven igual en todos los dispositivos y siguen el
// color del sistema. Las usan la pantalla de Logros y la celebración al desbloquear una.
export interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
  milestone: number;
}

export const INSIGNIAS: Insignia[] = [
  { id: "racha_3", nombre: "Primer Ritmo", descripcion: "3 días de racha consecutivos", icono: Flame, milestone: 3 },
  { id: "racha_7", nombre: "Una Semana Exacta", descripcion: "7 días de racha consecutivos", icono: Zap, milestone: 7 },
  { id: "racha_14", nombre: "Dos Semanas", descripcion: "14 días de racha consecutivos", icono: Star, milestone: 14 },
  { id: "racha_30", nombre: "El Mensual", descripcion: "30 días de racha consecutivos", icono: Trophy, milestone: 30 },
  { id: "racha_50", nombre: "Imparable", descripcion: "50 días de racha consecutivos", icono: Gem, milestone: 50 },
  { id: "racha_100", nombre: "Leyenda", descripcion: "100 días de racha consecutivos", icono: Crown, milestone: 100 },
];

export const insigniaDeHito = (dias: number) => INSIGNIAS.find((i) => i.milestone === dias) ?? null;
