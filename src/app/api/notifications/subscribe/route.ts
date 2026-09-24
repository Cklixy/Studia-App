import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

// Suscripción Web Push tal como la serializa PushSubscription.toJSON()
const suscripcionSchema = z.object({
  endpoint: z.string().url().startsWith("https://").max(1000),
  keys: z.object({
    p256dh: z.string().min(1).max(200),
    auth: z.string().min(1).max(100),
  }),
});

const bajaSchema = z.object({
  endpoint: z.string().url().max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = suscripcionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Suscripción no válida" }, { status: 400 });
    }
    const subscription = parsed.data;

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        { onConflict: "user_id,endpoint" }
      );

    if (error) {
      console.error("Error saving subscription:", error);
      return NextResponse.json({ error: "No se pudo guardar la suscripción" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Baja: antes «Silenciar» solo cancelaba la suscripción en el navegador y la fila seguía
// en la base, así que el cron seguía intentando enviarle recordatorios.
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = bajaSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", user.id)
      .eq("endpoint", parsed.data.endpoint);

    if (error) {
      console.error("Error deleting subscription:", error);
      return NextResponse.json({ error: "No se pudo desactivar el recordatorio" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
