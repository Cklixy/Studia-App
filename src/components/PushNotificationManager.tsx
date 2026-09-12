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

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

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
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      
      // Save subscription in our backend
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setSubscription(sub);
    } catch (err) {
      console.error("Failed to subscribe to push notifications", err);
    }
    setLoading(false);
  }

  async function unsubscribeFromPush() {
    setLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (err) {
      console.error("Failed to unsubscribe", err);
    }
    setLoading(false);
  }

  if (!isSupported) {
    return null; // Si no está soportado, es mejor no mostrar ruido en la interfaz
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 surface-panel p-6 border-l-4 border-l-warm-coral/50">
      <div className="flex-1">
        <h3 className="font-bold flex items-center gap-2 text-text-primary mb-1">
          <Bell size={18} className="text-warm-coral" /> Señal de Ruta
        </h3>
        <p className="text-sm text-text-secondary">
          Activa las notificaciones para que studia+ te recuerde continuar tu navegación todas las noches.
        </p>
      </div>
      <div>
        {subscription ? (
          <button
            onClick={unsubscribeFromPush}
            disabled={loading}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border border-white/10"
          >
            <BellOff size={16} /> Silenciar señal
          </button>
        ) : (
          <button
            onClick={subscribeToPush}
            disabled={loading}
            className="flex items-center gap-2 bg-signal-lime text-deep-ink hover:opacity-90 px-4 py-2 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
          >
            Activar señal
          </button>
        )}
      </div>
    </div>
  );
}
