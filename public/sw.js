/* Rawat.in service worker: receives server-originated Web Push messages. */
self.addEventListener('push', event => {
  let payload = { title: 'Rawat.in', body: 'Ada pengingat perawatan barang.', url: '/' };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch {}
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body, icon: '/icons.svg', badge: '/icons.svg',
    data: { url: payload.url || '/' }, tag: payload.tag || 'rawat-reminder'
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const target = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
    const match = windows.find(w => w.url.includes(target)); if (match) return match.focus(); return clients.openWindow(target);
  }));
});
