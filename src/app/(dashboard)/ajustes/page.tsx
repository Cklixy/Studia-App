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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 text-acento mb-2">
        <SettingsIcon size={24} aria-hidden="true" />
        <h1 className="text-3xl font-bold text-tinta">Ajustes</h1>
      </div>
      <p className="text-tinta-2 text-lg">
        Administra tu perfil, tus recordatorios y tus datos.
      </p>

      <SettingsClient email={user.email || ""} />
    </div>
  );
}
