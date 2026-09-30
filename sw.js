/* Code A-Z — service worker : uniquement pour recevoir les notifications push (aucun cache). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'Code A-Z';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: '/images/android-chrome-192x192.png',
    badge: '/images/favicon-32x32.png',
    data: { url: data.url || '/' }
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if (c.url === target && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(target);
  }));
});
