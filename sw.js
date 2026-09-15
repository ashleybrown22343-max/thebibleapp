// ============================================================
// SERVICE WORKER — Offline caching (except Studio)
// ============================================================

const CACHE_NAME = 'bibeli-mimo-v1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/style.css',
    '/shared.js',
    '/shared-nav.js',
    '/home.js',
    '/read/',
    '/read/index.html',
    '/read/read.js',
    '/read/chapter/',
    '/read/chapter/index.html',
    '/read/chapter/chapter.js',
    '/discover/',
    '/discover/index.html',
    '/discover/discover.js',
    '/discover/search/',
    '/discover/search/index.html',
    '/discover/search/search.js',
    '/library/',
    '/library/index.html',
    '/library/library.js',
    '/more/',
    '/more/index.html',
    '/more/more.js',
    '/settings/',
    '/settings/index.html',
    '/settings/settings.js',
    '/about/',
    '/about/index.html',
    '/about/about.js',
    '/download/',
    '/download/index.html',
    '/download/download.js',
    '/404.html',
    '/data/yoruba.json',
    '/data/english_nkj.json'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(APP_SHELL).catch(function (err) {
                console.warn('Some files failed to cache:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    var url = new URL(event.request.url);

    // Studio: always network (never cached)
    if (url.pathname.indexOf('/studio') === 0) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Only handle GET
    if (event.request.method !== 'GET') return;

    // Cross-origin (fonts, images from CDN): cache-first with network fallback
    if (url.origin !== self.location.origin) {
        event.respondWith(
            caches.match(event.request).then(function (cached) {
                return cached || fetch(event.request).then(function (response) {
                    return response;
                }).catch(function () { return cached; });
            })
        );
        return;
    }

    // Same-origin: cache-first with background refresh
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) {
                // Refresh in background
                fetch(event.request).then(function (response) {
                    if (response && response.status === 200) {
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, response.clone());
                        });
                    }
                }).catch(function () {});
                return cached;
            }

            return fetch(event.request).then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, clone);
                });
                return response;
            }).catch(function () {
                if (event.request.mode === 'navigate') {
                    return caches.match('/404.html');
                }
                return null;
            });
        })
    );
});
