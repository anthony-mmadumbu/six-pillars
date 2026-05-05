// Six Pillars service worker — caches the app shell for offline use
const CACHE_NAME = 'six-pillars-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for HTML so updates show up; cache-first for assets
  const { request } = event;
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((res) => {
            // Cache successful CDN responses too
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
