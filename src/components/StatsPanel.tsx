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
  <div className="apple-card p-5 flex flex-col justify-between relative overflow-hidden group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[12px] font-medium text-arctic-secondary tracking-tight">
        {label}
      </span>
      <div className={`w-8 h-8 rounded-xl ${accentBg} ${accentColor} flex items-center justify-center shadow-apple-sm transition-transform duration-200 group-hover:scale-105`}>
        {icon}
      </div>
    </div>

    <div className="mt-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-arctic-slate tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-arctic-secondary">
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <div className="text-[11px] text-arctic-secondary mt-1 font-normal">
          {sublabel}
        </div>
      )}
    </div>

    {progress !== undefined && (
      <div className="mt-4 w-full bg-black/[0.05] rounded-full h-1.5 overflow-hidden">
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
    <section className="space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-semibold tracking-tight text-arctic-slate flex items-center gap-2">
          <span>Resumen de Actividad</span>
          <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-slate-200/60 text-arctic-slate/80">
            Últimos 30 días
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <StatCard
          label="Tiempo de Enfoque"
          value={tiempoDisplay}
          sublabel={`${totalMinutos} minutos acumulados`}
          accentBg="bg-glacier-blue/10"
          accentColor="text-glacier-blue"
          progressColor="bg-glacier-blue"
          icon={<Clock size={16} />}
          progress={Math.min(100, (totalMinutos / 1200) * 100)}
        />
        <StatCard
          label="Efectividad"
          value={`${efectividad}%`}
          sublabel="Metas de sesión cumplidas"
          accentBg="bg-polar-cyan/10"
          accentColor="text-polar-cyan"
          progressColor="bg-polar-cyan"
          icon={<Target size={16} />}
          progress={efectividad}
        />
        <StatCard
          label="Sesiones Completadas"
          value={totalSesiones}
          unit="sesiones"
          sublabel="Registros de estudio activo"
          accentBg="bg-cool-iris/10"
          accentColor="text-cool-iris"
          progressColor="bg-cool-iris"
          icon={<BookOpen size={16} />}
          progress={Math.min(100, (totalSesiones / 30) * 100)}
        />
        <StatCard
          label={`Nivel ${nivelActual}`}
          value={`${xpTotal.toLocaleString()}`}
          unit="XP"
          sublabel="Puntos de experiencia"
          accentBg="bg-cool-berry/10"
          accentColor="text-cool-berry"
          progressColor="bg-cool-berry"
          icon={<Trophy size={16} />}
          progress={Math.min(100, (xpTotal % 1000) / 10)}
        />
      </div>
    </section>
  );
}
