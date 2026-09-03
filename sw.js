// NUCLEAR CACHE WIPER: Deletes all old cache, forces network load.
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
        })
    );
    self.clients.claim();
});

// No caching at all. Always fetch from Vercel.
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});
