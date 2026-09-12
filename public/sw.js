self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "¡Notificación de studia+!";
  const options = {
    body: data.body || "No olvides estudiar hoy.",
    icon: "/icon.png",
    badge: "/badge.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});

self.addEventListener("fetch", (event) => {
  // Manejo básico de fetch para que la app cumpla con los requisitos PWA y sea instalable
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
