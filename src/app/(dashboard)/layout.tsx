import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import BrandLogo from "@/components/BrandLogo";
import SidebarNav from "@/components/SidebarNav";
import type { Metadata } from "next";

// Cargado de forma dinámica (client-only) — depende de localStorage y motion
const OnboardingTour = dynamic(() => import("@/components/OnboardingTour"), {
  ssr: false,
});

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
    <div className="min-h-dvh text-arctic-slate flex flex-col bg-frost-base relative">
      {/* Top Navigation & Brand Header */}
      <header className="sticky top-0 z-40 w-full apple-glass-ultra border-b border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all select-none" style={{paddingTop: 'env(safe-area-inset-top, 0px)'}}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo />
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none px-3 py-4 sm:px-6 lg:px-10 sm:py-8 max-w-[1280px] w-full mx-auto pb-32 sm:pb-36 md:pb-40">
        {children}
      </main>

      {/* Floating Apple Dock at the Bottom */}
      <div className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-auto px-2 sm:px-3 max-w-full" style={{bottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))'}} >
        <SidebarNav />
      </div>

      {/* Onboarding Tour — solo para usuarios nuevos */}
      <OnboardingTour />
    </div>
  );
}
