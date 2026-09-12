"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Racha = {
  dias: number;
};

export default function StudyTrailWidget() {
  const [racha, setRacha] = useState<Racha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamification = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("rachas")
        .select("dias")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setRacha(data);
      } else {
        setRacha({ dias: 0 });
      }
      setLoading(false);
    };

    fetchGamification();
  }, []);

  if (loading) {
    return <div className="h-24 surface-panel animate-pulse w-full"></div>;
  }

  const dias = racha?.dias || 0;

  if (dias === 0) return null; // Si no hay racha, mantenemos la interfaz limpia

  return (
    <section className="space-y-4 animate-in fade-in duration-700 delay-300">
      <h3 className="text-sm uppercase tracking-widest text-text-secondary font-bold">Tu recorrido</h3>
      <div className="surface-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-electric-periwinkle">
        <div>
          <p className="text-xl">
            Has mantenido el ritmo por <span className="font-display font-bold text-electric-periwinkle text-2xl mx-1">{dias}</span> días consecutivos.
          </p>
          <p className="text-text-secondary mt-1">La constancia construye la ruta más directa.</p>
        </div>
        <div className="flex gap-2">
           {/* Visualización conceptual de racha */}
           {[...Array(Math.min(dias, 5))].map((_, i) => (
             <div key={i} className="w-2 h-8 rounded-full bg-electric-periwinkle/30 flex flex-col justify-end overflow-hidden">
               <div className="w-full bg-electric-periwinkle rounded-full animate-in slide-in-from-bottom duration-1000" style={{ height: `${(i+1)*20}%`, animationDelay: `${i*150}ms` }}></div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
