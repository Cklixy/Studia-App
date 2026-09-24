// Service worker de studia+: solo notificaciones push.
// No intercepta peticiones (sin manejador "fetch"): antes reenviaba cada petición sin cachear
// nada y, sin red, respondía con undefined, lo que rompía la navegación offline.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // Payload no JSON: se usan los textos por defecto
  }

  const title = data.title || "¡Notificación de studia+!";
  const options = {
    body: data.body || "No olvides estudiar hoy.",
    icon: "/icons/icon-192x192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Solo se abren rutas del propio sitio
  let destino = "/";
  try {
    const url = new URL(event.notification.data?.url || "/", self.location.origin);
    if (url.origin === self.location.origin) destino = url.pathname + url.search;
  } catch {
    // URL inválida: se abre la raíz
  }

  event.waitUntil(self.clients.openWindow(destino));
});
