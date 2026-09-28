// ============================================================
// SERVICE WORKER — Offline caching
// NOTE: /studio/* is intentionally NOT cached (network-only)
// ============================================================

const CACHE_NAME = 'bibeli-mimo-v4';

const APP_SHELL = [
    '/',
    '/index.html',
    '/home.js',
    '/style.css',
    '/shared.js',
    '/shared-nav.js',

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
    '/offline.html',

    '/data/yoruba.json',
    '/data/english_nkj.json'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return Promise.all(
                APP_SHELL.map(function (url) {
                    return cache.add(url).catch(function (err) {
                        console.warn('SW: could not cache ' + url, err);
                    });
                })
            );
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
    if (event.request.method !== 'GET') return;

    // STUDIO — always network (monetization: no offline use).
    if (url.pathname.indexOf('/studio') === 0) {
        event.respondWith(
            fetch(event.request).catch(function () {
                return caches.match('/offline.html');
            })
        );
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(function (response) {
                if (response && response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function () {
                return caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
                    if (cached) return cached;
                    var base = url.pathname;
                    if (base.charAt(base.length - 1) === '/') base += 'index.html';
                    return caches.match(base).then(function (c) {
                        return c || caches.match('/offline.html');
                    });
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            return fetch(event.request).then(function (response) {
                if (response && response.status === 200 && response.type === 'basic') {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function () { return null; });
        })
    );
});
