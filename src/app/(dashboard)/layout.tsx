import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
    <div className="min-h-dvh text-arctic-slate flex flex-col bg-frost-base relative">
      {/* Top Navigation & Brand Header */}
      <header className="sticky top-0 z-40 w-full bg-white/92 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all select-none" style={{paddingTop: 'env(safe-area-inset-top, 0px)'}}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo />
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-10 sm:py-8 max-w-[1280px] w-full mx-auto pb-36 md:pb-40">
        {children}
      </main>

      {/* Floating Apple Dock at the Bottom */}
      <div className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-auto px-3 max-w-full" style={{bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))'}} >
        <SidebarNav />
      </div>
    </div>
  );
}
