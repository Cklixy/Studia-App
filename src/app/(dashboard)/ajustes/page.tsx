import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Ajustes · studia+" };

export default async function AjustesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <header>
        <h1 className="titulo-1">Ajustes</h1>
        <p className="subtitulo mt-1.5">Tu cuenta, cómo se ve studia+, tus recordatorios y tus datos.</p>
      </header>
      <SettingsClient email={user.email || ""} />
    </div>
  );
}
