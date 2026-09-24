import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
export const dynamic = 'force-dynamic';
import { createClient } from "@supabase/supabase-js";

// A2: Dominios permitidos para push notifications.
// Configura ALLOWED_PUSH_HOSTS en .env como lista separada por comas.
// Fallback: dominios oficiales de FCM (Google) y Mozilla.
const DEFAULT_ALLOWED_PUSH_HOSTS = new Set([
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "updates-autopush.stage.mozaws.net", // staging de Mozilla
  "push.services.mozilla.com",
]);

function isAllowedEndpoint(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    // 1. Solo HTTPS
    if (url.protocol !== "https:") return false;
    // 2. Hostname en lista blanca
    const allowedHosts = process.env.ALLOWED_PUSH_HOSTS
      ? new Set(process.env.ALLOWED_PUSH_HOSTS.split(",").map((h) => h.trim().toLowerCase()))
      : DEFAULT_ALLOWED_PUSH_HOSTS;
    return allowedHosts.has(url.hostname.toLowerCase());
  } catch {
    // URL malformada
    return false;
  }
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");

  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      "mailto:test@studia-plus.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }

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

    // A2: Validar cada endpoint antes de hacer fetch hacia él.
    // Suscripciones con endpoint inválido se loguean y se limpian de la DB.
    const invalidSubs: any[] = [];
    const validSubs = targetSubscriptions.filter((sub: any) => {
      if (isAllowedEndpoint(sub.endpoint)) return true;
      console.warn("[SSRF-guard] Endpoint rechazado:", sub.endpoint, "— subscription_id:", sub.id);
      invalidSubs.push(sub);
      return false;
    });

    // Limpiar suscripciones con endpoints maliciosos/expirados
    if (invalidSubs.length > 0) {
      const invalidIds = invalidSubs.map((s: any) => s.id).filter(Boolean);
      if (invalidIds.length > 0) {
        await supabase.from("push_subscriptions").delete().in("id", invalidIds);
      }
    }

    if (validSubs.length === 0) {
      return NextResponse.json({ message: "No valid subscriptions to notify." });
    }

    // 3. Enviar notificaciones Push solo a endpoints validados
    const notificationPayload = JSON.stringify({
      title: "🔥 ¡No pierdas tu racha!",
      body: "Aún no has estudiado hoy. Entra a studia+ y completa al menos una sesión de 10 minutos para mantener tu racha.",
      url: "/materias"
    });

    const sendPromises = validSubs.map((sub: any) => {
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
      notified: validSubs.length,
      rejected: invalidSubs.length,
    });

  } catch (error: any) {
    console.error("Cron Job Error:", error);
    // M7: No exponer error.message al cliente
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
