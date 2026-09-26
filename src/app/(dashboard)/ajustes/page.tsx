import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EncabezadoPantalla from "@/components/ui/EncabezadoPantalla";
import { obtenerEstadoPlan } from "@/lib/plan";
import SettingsClient from "./SettingsClient";

export default async function AjustesPage({ searchParams }: { searchParams: { pestana?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <EncabezadoPantalla
        titulo="Ajustes"
        descripcion="Administra tu perfil, tu plan, tus recordatorios y tus datos."
      />

      <SettingsClient
        email={user.email || ""}
        estadoPlan={await obtenerEstadoPlan(supabase)}
        pestanaInicial={searchParams.pestana === "plan" ? "plan" : "perfil"}
      />
    </div>
  );
}
