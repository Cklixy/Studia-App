import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// Exige escribir la palabra de confirmación, igual que en la interfaz
const eliminarSchema = z.object({ confirmacion: z.literal("ELIMINAR") });

// Elimina la cuenta y todos sus datos (derecho de supresión, Ley 1581 de 2012).
// Las tablas del usuario tienen ON DELETE CASCADE sobre auth.users, así que basta con borrar el usuario.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = eliminarSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Escribe ELIMINAR para confirmar" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Eliminar cuenta: falta SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "No se pudo eliminar la cuenta en este momento" }, { status: 500 });
  }

  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Eliminar cuenta:", error);
    return NextResponse.json({ error: "No se pudo eliminar la cuenta en este momento" }, { status: 500 });
  }

  // Borra las cookies de sesión del navegador
  await supabase.auth.signOut().catch(() => {});
  return NextResponse.json({ ok: true });
}
