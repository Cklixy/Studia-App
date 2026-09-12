import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Map, History, Calendar, Sparkles, Settings } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen text-text-primary flex">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 p-7 bg-deep-surface/55 backdrop-blur-xl border-r border-white/5 flex flex-col gap-9 h-screen sticky top-0">
        <div className="font-display font-bold text-xl tracking-tight">
          studia<span className="text-signal-lime">+</span>
        </div>
        
        <SidebarNav />
        
        <div className="mt-auto space-y-4">
          <div className="text-xs color-text-secondary leading-relaxed opacity-60">
            Sesión activa se guarda<br/>automáticamente.
          </div>
          
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-white transition-colors">
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile nav fallback (hidden on md) */}
      <div className="md:hidden fixed bottom-0 w-full bg-deep-surface/80 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around text-xs font-medium uppercase tracking-widest text-text-secondary z-50">
        <Link href="/materias" className="hover:text-electric-periwinkle transition-colors flex flex-col items-center gap-1">
          <Map size={18} /> Mapa
        </Link>
        <Link href="/historial" className="hover:text-electric-periwinkle transition-colors flex flex-col items-center gap-1">
          <History size={18} /> Historial
        </Link>
      </div>

      <main className="flex-1 p-9 md:p-11 max-w-[1180px] w-full">
        {children}
      </main>
    </div>
  );
}
