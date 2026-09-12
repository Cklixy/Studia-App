import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Settings as SettingsIcon } from "lucide-react";
import SettingsClient from "./SettingsClient";

export default async function AjustesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 text-electric-periwinkle mb-2">
        <SettingsIcon size={24} />
        <h1 className="text-3xl font-display font-bold text-text-primary">Ajustes</h1>
      </div>
      <p className="text-text-secondary text-lg">
        Administra tu perfil, preferencias y suscripción.
      </p>

      <SettingsClient email={user.email || ""} />
    </div>
  );
}
