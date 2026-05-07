const CACHE_NAME = 'six-pillars-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).then(r => { caches.open(CACHE_NAME).then(c => c.put(request, r.clone())); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(request).then(cached => cached || fetch(request).then(r => { if (r && r.status === 200) caches.open(CACHE_NAME).then(c => c.put(request, r.clone())).catch(()=>{}); return r; })));
});
