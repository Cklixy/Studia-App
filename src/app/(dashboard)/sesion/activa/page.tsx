"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCw, ArrowRight, Clock, X, MoreHorizontal, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Módulos de estudio (Métodos)
const studyMethods = [
  { id: "active_recall", label: "Active Recall", icon: RotateCw, color: "text-signal-lime", desc: "Recuperar información" },
  { id: "feynman", label: "Técnica Feynman", icon: ArrowRight, color: "text-electric-lavender", desc: "Explicar para entender" },
  { id: "pomodoro", label: "Pomodoro", icon: Clock, color: "text-warm-coral", desc: "Tiempo estructurado" },
  { id: "practica", label: "Práctica activa", icon: X, color: "text-electric-periwinkle", desc: "Resolver y repetir" },
  { id: "espaciada", label: "Repetición espaciada", icon: MoreHorizontal, color: "text-electric-lavender", desc: "Volver en el momento correcto" },
];

export default function FocusRunPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materiaId = searchParams.get("materia");
  const temaId = searchParams.get("tema");

  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutos default
  const [isActive, setIsActive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(studyMethods[0]);
  const [materiaName, setMateriaName] = useState("Cargando ruta...");
  const [temaName, setTemaName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch context names
    const fetchContext = async () => {
      if (!materiaId) return;
      const supabase = createClient();
      const { data: materia } = await supabase.from("materias").select("nombre").eq("id", materiaId).single();
      if (materia) setMateriaName(materia.nombre);

      if (temaId) {
        const { data: tema } = await supabase.from("temas").select("nombre").eq("id", temaId).single();
        if (tema) setTemaName(tema.nombre);
      }
    };
    fetchContext();
  }, [materiaId, temaId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFinish = async () => {
    // Mostrar modal en lugar de alert
    setShowModal(true);
  };

  const confirmFinish = () => {
    router.push("/materias");
  };

  const totalTime = 40 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-deep-ink text-text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow matching the method */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000 ${selectedMethod.color.replace('text-', 'bg-')}`}></div>

      <div className="z-10 text-center space-y-2 mb-12">
        <p className="text-sm tracking-widest uppercase opacity-70 font-medium">
          {materiaName}
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {temaName || "Sesión de Enfoque"}
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center mb-16">
        
        {/* Temporizador circular como una trayectoria */}
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-72 h-72">
            <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
            
            {/* Camino recorrido */}
            <circle 
              cx="144" 
              cy="144" 
              r="120" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-signal-lime transition-all duration-1000 ease-linear" 
            />
          </svg>

          {/* Marcadores de la ruta (Nodos) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 rounded-full bg-deep-ink border-2 border-white/20"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mt-1 w-3 h-3 rounded-full bg-deep-ink border-2 border-white/20"></div>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <h2 className="text-6xl font-display font-bold tracking-tighter tabular-nums">
              {formatTime(timeLeft)}
            </h2>
            <p className="text-sm mt-2 opacity-60">
              {isActive ? "Estás en ruta." : "Pausado"}
            </p>
          </div>
        </div>

      </div>

      <div className="z-10 surface-panel px-6 py-4 flex items-center gap-4 mb-12 max-w-sm w-full">
        <selectedMethod.icon size={24} className={selectedMethod.color} />
        <div>
          <p className="font-bold text-sm">{selectedMethod.label}</p>
          <p className="text-xs text-text-secondary">{selectedMethod.desc}</p>
        </div>
      </div>

      <div className="z-10 flex gap-4">
        <button 
          onClick={toggleTimer}
          className="surface-elevated px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-colors"
        >
          {isActive ? "Pausar" : "Reanudar"}
        </button>
        <button 
          onClick={handleFinish}
          className="bg-transparent border border-white/20 text-text-secondary px-8 py-3 rounded-full font-medium hover:text-white hover:border-white/40 transition-colors"
        >
          Finalizar
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="surface-panel p-8 rounded-2xl max-w-sm w-full text-center border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-electric-periwinkle/10 text-electric-periwinkle rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2 text-text-primary">¡Movimiento Registrado!</h3>
            <p className="text-text-secondary mb-8">Has sumado <span className="font-bold text-white">+40 min</span> a tu recorrido de aprendizaje. ¡Buen trabajo!</p>
            <button 
              onClick={confirmFinish}
              className="btn-action w-full font-bold py-3"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
