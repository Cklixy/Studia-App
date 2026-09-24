import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// A2: Dominios permitidos para push notifications.
// Configura ALLOWED_PUSH_HOSTS en .env como lista separada por comas.
// Fallback: servicios push oficiales de Chrome (FCM), Firefox (Mozilla), Safari/iOS (Apple)
// y Edge (WNS). Una entrada que empieza por "." admite cualquier subdominio.
const DEFAULT_ALLOWED_PUSH_HOSTS = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "push.services.mozilla.com",
  "web.push.apple.com",
  ".notify.windows.com",
];

function hostPermitido(hostname: string, permitidos: string[]): boolean {
  return permitidos.some((h) =>
    h.startsWith(".") ? hostname.endsWith(h) : hostname === h
  );
}

// Comparación en tiempo constante para no filtrar el secreto por tiempos de respuesta
function secretoValido(authHeader: string | null, secreto: string): boolean {
  const esperado = Buffer.from(`Bearer ${secreto}`);
  const recibido = Buffer.from(authHeader ?? "");
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
}

function isAllowedEndpoint(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    // 1. Solo HTTPS
    if (url.protocol !== "https:") return false;
    // 2. Hostname en lista blanca
    const allowedHosts = process.env.ALLOWED_PUSH_HOSTS
      ? process.env.ALLOWED_PUSH_HOSTS.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean)
      : DEFAULT_ALLOWED_PUSH_HOSTS;
    return hostPermitido(url.hostname.toLowerCase(), allowedHosts);
  } catch {
    // URL malformada
    return false;
  }
}

export async function GET(request: NextRequest) {
  // 1. Proteger el endpoint con el secreto. Sin CRON_SECRET configurado se rechaza todo:
  //    antes, "Bearer undefined" pasaba la comprobación.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !secretoValido(request.headers.get("Authorization"), cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // La RPC solo la puede ejecutar service_role; no hay alternativa con la anon key.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Cron: faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      "mailto:test@studia-plus.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
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

    // A2: Validar cada endpoint antes de hacer fetch hacia él (SSRF).
    // Solo se registra el host: el endpoint completo identifica al usuario.
    const invalidSubs: any[] = [];
    const validSubs = targetSubscriptions.filter((sub: any) => {
      if (isAllowedEndpoint(sub.endpoint)) return true;
      let host = "url-invalida";
      try { host = new URL(sub.endpoint).hostname; } catch {}
      console.warn("[SSRF-guard] Endpoint rechazado, host:", host);
      invalidSubs.push(sub);
      return false;
    });

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
      return webpush.sendNotification(pushSubscription, notificationPayload).catch((err) => {
        console.error("Push fallido, status:", err?.statusCode ?? "desconocido");
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
