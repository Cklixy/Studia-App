"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 px-4 py-2 bg-warm-coral/10 hover:bg-warm-coral/20 text-warm-coral rounded-xl font-medium transition-colors disabled:opacity-50"
    >
      <LogOut size={18} />
      {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
    </button>
  );
}
