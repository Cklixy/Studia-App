import { Clock, Target, BookOpen, Trophy } from "lucide-react";
import React from "react";

interface StatsPanelProps {
  totalMinutos: number;
  efectividad: number;
  totalSesiones: number;
  nivelActual: number;
  xpTotal: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  accentBg: string;
  accentColor: string;
  progressColor: string;
  icon: React.ReactNode;
  progress?: number;
}

const StatCard = ({
  label,
  value,
  unit,
  sublabel,
  accentBg,
  accentColor,
  progressColor,
  icon,
  progress,
}: StatCardProps) => (
  <div className="tarjeta p-5 flex flex-col justify-between relative overflow-hidden group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-tinta-2 tracking-tight">
        {label}
      </span>
      <div className={`w-8 h-8 rounded-xl ${accentBg} ${accentColor} flex items-center justify-center shadow-1 transition-transform duration-200 group-hover:scale-105`}>
        {icon}
      </div>
    </div>

    <div className="mt-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-tinta tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-tinta-2">
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <div className="text-xs text-tinta-2 mt-1 font-normal">
          {sublabel}
        </div>
      )}
    </div>

    {progress !== undefined && (
      <div className="mt-4 w-full bg-hundido rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${progressColor} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    )}
  </div>
);

export default function StatsPanel({
  totalMinutos,
  efectividad,
  totalSesiones,
  nivelActual,
  xpTotal,
}: StatsPanelProps) {
  const horas = Math.floor(totalMinutos / 60);
  const minutosRestantes = totalMinutos % 60;
  const tiempoDisplay = horas > 0 ? `${horas}h ${minutosRestantes}m` : `${minutosRestantes}m`;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h3 className="titulo-3 flex flex-wrap items-center gap-2">
          <span>Resumen de Actividad</span>
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-hundido text-tinta-3">
            Últimos 30 días
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Tiempo de Enfoque"
          value={tiempoDisplay}
          sublabel={`${totalMinutos === 1 ? "1 minuto acumulado" : `${totalMinutos} minutos acumulados`}`}
          accentBg="bg-acento/10"
          accentColor="text-acento"
          progressColor="bg-acento"
          icon={<Clock size={16} strokeWidth={2} />}
          progress={Math.min(100, (totalMinutos / 1200) * 100)}
        />
        <StatCard
          label="Efectividad"
          value={`${efectividad}%`}
          sublabel="Metas de sesión cumplidas"
          accentBg="bg-exito/10"
          accentColor="text-exito"
          progressColor="bg-exito"
          icon={<Target size={16} strokeWidth={2} />}
          progress={efectividad}
        />
        <StatCard
          label="Sesiones Completadas"
          value={totalSesiones}
          unit={totalSesiones === 1 ? "sesión" : "sesiones"}
          sublabel="Registros de estudio activo"
          accentBg="bg-acento/10"
          accentColor="text-acento"
          progressColor="bg-acento"
          icon={<BookOpen size={16} strokeWidth={2} />}
          progress={Math.min(100, (totalSesiones / 30) * 100)}
        />
        <StatCard
          label={`Nivel ${nivelActual}`}
          value={`${xpTotal.toLocaleString()}`}
          unit="XP"
          sublabel="Puntos de experiencia"
          accentBg="bg-aviso/10"
          accentColor="text-aviso"
          progressColor="bg-aviso"
          icon={<Trophy size={16} strokeWidth={2} />}
          progress={Math.min(100, (xpTotal % 1000) / 10)}
        />
      </div>
    </section>
  );
}
