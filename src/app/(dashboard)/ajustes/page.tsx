import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import SettingsClient from "./SettingsClient";

export default async function AjustesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <EncabezadoPantalla
        titulo="Ajustes"
        descripcion="Administra tu perfil, tus recordatorios y tus datos."
      />

      <SettingsClient email={user.email || ""} />
    </div>
  );
}
