"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Square } from "lucide-react";

export default function ActiveSessionTimer({ session }: { session: any }) {
  const router = useRouter();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [pausasCount, setPausasCount] = useState(0);

  const durationSeconds = session.duracion_planificada_minutos * 60;
  const remaining = Math.max(0, durationSeconds - secondsElapsed);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, remaining]);

  const togglePause = () => {
    if (isActive) {
      setPausasCount(p => p + 1);
    }
    setIsActive(!isActive);
  };

  const handleFinish = () => {
    // Navigate to feedback page with the elapsed time in query string to pre-fill or pass state
    // Or we could save it right now and then redirect. Let's redirect to summary which will handle the final save
    router.push(`/sesion/resumen/${session.id}?elapsed=${secondsElapsed}&pauses=${pausasCount}`);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="surface-elevated w-full p-8 md:p-12 rounded-2xl text-center flex flex-col items-center">
      <h2 className="text-xl opacity-70 mb-2">Estudiando</h2>
      <h1 className="text-3xl font-bold mb-1">{session.materias?.nombre || "Materia desconocida"}</h1>
      <h3 className="text-xl mb-8">{session.temas?.nombre || "Tema desconocido"}</h3>

      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-10">
        {/* Simple progress ring */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="48%" className="stroke-white/10 fill-none" strokeWidth="8" />
          <circle 
            cx="50%" cy="50%" r="48%" 
            className="stroke-signal-lime fill-none transition-all duration-1000 ease-linear" 
            strokeWidth="8" 
            strokeDasharray={`${2 * Math.PI * 48}%`}
            strokeDashoffset={`${((durationSeconds - remaining) / durationSeconds) * (2 * Math.PI * 48)}%`}
          />
        </svg>
        <div className="z-10 flex flex-col items-center">
          <span className="text-6xl md:text-7xl font-mono font-bold tracking-tighter">
            {formatTime(remaining)}
          </span>
          <span className="text-sm opacity-50 mt-2">restantes</span>
        </div>
      </div>

      <div className="bg-foreground/5 p-4 rounded-lg w-full mb-8 text-left">
        <strong className="block text-sm uppercase opacity-50 tracking-wider mb-1">Método Sugerido</strong>
        <p className="text-lg font-medium">{session.metodo_recomendado}</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={togglePause}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition ${isActive ? 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30' : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'}`}
        >
          {isActive ? <><Pause /> Pausar</> : <><Play /> Reanudar</>}
        </button>
        <button 
          onClick={handleFinish}
          className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-md transition"
        >
          <Square fill="currentColor" size={20} /> Finalizar
        </button>
      </div>
    </div>
  );
}
