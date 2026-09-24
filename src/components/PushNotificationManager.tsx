"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// El cron (vercel.json) se ejecuta a las 20:00 UTC = 3:00 p. m. en Colombia.
// Antes el texto prometía un recordatorio «todas las noches» (auditoría U-16).
const HORA_RECORDATORIO = "3:00 p. m.";

export default function PushNotificationManager({ compacto = false }: { compacto?: boolean }) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "exito"; texto: string } | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error("Service Worker registration failed", err);
    }
  }

  async function subscribeToPush() {
    setLoading(true);
    setAviso(null);
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "denied") {
        setAviso({
          tipo: "error",
          texto: "Las notificaciones están bloqueadas en tu navegador. Actívalas en los ajustes del sitio y vuelve a intentarlo.",
        });
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error("guardar");

      setSubscription(sub);
      setAviso({ tipo: "exito", texto: `Listo: te avisaremos a las ${HORA_RECORDATORIO} los días que aún no hayas estudiado.` });
    } catch (err) {
      console.error("Failed to subscribe to push notifications", err);
      setAviso({
        tipo: "error",
        texto:
          typeof Notification !== "undefined" && Notification.permission === "denied"
            ? "No diste permiso para las notificaciones. Puedes activarlo en los ajustes del sitio."
            : "No pudimos activar el recordatorio. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setLoading(true);
    setAviso(null);
    try {
      if (subscription) {
        // Primero la base (si no, el cron seguía enviando a esta suscripción) y luego el navegador
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
        setSubscription(null);
        setAviso({ tipo: "exito", texto: "Recordatorio desactivado." });
      }
    } catch (err) {
      console.error("Failed to unsubscribe", err);
      setAviso({ tipo: "error", texto: "No pudimos desactivar el recordatorio. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return compacto ? (
      <p className="text-sm text-arctic-secondary">
        Tu navegador no admite notificaciones. En iPhone, añade studia+ a la pantalla de inicio para activarlas.
      </p>
    ) : null;
  }

  return (
    <div className={compacto ? "space-y-3" : "flex flex-col md:flex-row md:items-center gap-6 apple-card p-6 border-l-4 border-l-glacier-blue shadow-apple-sm"}>
      <div className="flex-1">
        <h3 className="font-bold flex items-center gap-2 text-arctic-slate mb-1 text-base">
          <Bell size={18} className="text-glacier-blue" aria-hidden="true" /> Recordatorio diario
        </h3>
        <p className="text-sm text-arctic-secondary">
          {subscription
            ? `Activado: te avisaremos a las ${HORA_RECORDATORIO} (hora de Colombia) si ese día aún no has estudiado.`
            : `Recibe un aviso a las ${HORA_RECORDATORIO} (hora de Colombia) los días que aún no hayas estudiado, para no perder tu racha.`}
        </p>
        {aviso && (
          <p
            role={aviso.tipo === "error" ? "alert" : "status"}
            className={`text-sm mt-2 font-medium ${aviso.tipo === "error" ? "text-cool-berry" : "text-emerald-800"}`}
          >
            {aviso.texto}
          </p>
        )}
      </div>
      <div>
        {subscription ? (
          <button
            type="button"
            onClick={unsubscribeFromPush}
            disabled={loading}
            className="btn-apple-secondary text-sm min-h-11 px-4 inline-flex items-center gap-2 apple-tactile disabled:opacity-50"
          >
            <BellOff size={16} aria-hidden="true" /> Desactivar recordatorio
          </button>
        ) : (
          <button
            type="button"
            onClick={subscribeToPush}
            disabled={loading}
            className="btn-apple-primary text-sm min-h-11 px-5 font-semibold inline-flex items-center gap-2 apple-tactile shadow-apple-sm disabled:opacity-50"
          >
            <Bell size={15} aria-hidden="true" /> Activar recordatorio
          </button>
        )}
      </div>
    </div>
  );
}
