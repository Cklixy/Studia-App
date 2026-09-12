import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// We use the anon key. The RPC function is SECURITY DEFINER, so it can bypass RLS internally.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

webpush.setVapidDetails(
  "mailto:test@studia-plus.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(request: NextRequest) {
  // 1. Proteger el endpoint con el secreto
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Ejecutar la función RPC que retorna solo los usuarios que no han estudiado hoy
    const { data: targetSubscriptions, error: rpcError } = await supabase
      .rpc("get_subscriptions_for_inactive_users");

    if (rpcError) {
      throw new Error(`Error fetching subscriptions from RPC: ${rpcError.message}`);
    }

    if (!targetSubscriptions || targetSubscriptions.length === 0) {
      return NextResponse.json({ message: "No reminders to send today!" });
    }

    // 3. Enviar notificaciones Push
    const notificationPayload = JSON.stringify({
      title: "🔥 ¡No pierdas tu racha!",
      body: "Aún no has estudiado hoy. Entra a studia+ y completa al menos una sesión de 10 minutos para mantener tu racha.",
      url: "/materias"
    });

    const sendPromises = targetSubscriptions.map((sub: any) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      return webpush.sendNotification(pushSubscription, notificationPayload).catch(err => {
        console.error("Push failed for endpoint", sub.endpoint, err);
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ 
      success: true, 
      notified: targetSubscriptions.length 
    });

  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
