import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import SidebarNav from "@/components/SidebarNav";
import Avisos from "@/components/ui/Avisos";
import type { Metadata } from "next";

// Las páginas con sesión no deben indexarse
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
    <div className="min-h-dvh flex flex-col">
      <header className="barra-superior sticky top-0 z-40 select-none" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center">
          <BrandLogo href="/hoy" />
        </div>
      </header>

      {/* pb reserva el alto del dock + la zona segura: nada queda tapado (problema 2 de la línea base) */}
      <main
        id="contenido"
        tabIndex={-1}
        className="flex-1 focus:outline-none w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10"
        style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {children}
      </main>

      {/* Dock: barra completa en móvil, píldora flotante desde sm */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4">
        <SidebarNav />
      </div>

      <Avisos />
    </div>
  );
}
