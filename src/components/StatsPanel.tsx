import { Clock, Target, BookOpen, Trophy } from "lucide-react";
import React from "react";

interface StatsPanelProps {
  totalMinutos: number;
  efectividad: number;
  totalSesiones: number;
  nivelActual: number;
  xpTotal: number;
}

const StatCard = ({ label, value, colorClass, icon }: { label: string, value: string | number, colorClass: string, icon: React.ReactNode }) => (
  <div className="surface-panel p-6 flex flex-col items-center justify-center text-center gap-3">
    <div className={colorClass}>{icon}</div>
    <span className="text-3xl font-display font-bold">{value}</span>
    <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">{label}</span>
  </div>
);

export default function StatsPanel({ totalMinutos, efectividad, totalSesiones, nivelActual, xpTotal }: StatsPanelProps) {
  return (
    <section>
      <h3 className="font-display text-lg font-semibold mb-5">Tus Estadísticas</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Minutos (30d)"
          value={totalMinutos}
          colorClass="text-electric-periwinkle"
          icon={<Clock size={28} />}
        />
        <StatCard
          label="Efectividad"
          value={`${efectividad}%`}
          colorClass="text-signal-lime"
          icon={<Target size={28} />}
        />
        <StatCard
          label="Sesiones"
          value={totalSesiones}
          colorClass="text-electric-lavender"
          icon={<BookOpen size={28} />}
        />
        <StatCard
          label={`Nivel ${nivelActual}`}
          value={`${xpTotal} XP`}
          colorClass="text-warm-coral"
          icon={<Trophy size={28} />}
        />
      </div>
    </section>
  );
}
