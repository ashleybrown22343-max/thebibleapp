const CACHE_NAME = 'bible-mimo-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/shared.js',
    '/books/index.html',
    '/books/books.js',
    '/search/index.html',
    '/search/search.js',
    '/library/index.html',
    '/library/library.js',
    '/plans/index.html',
    '/daily/index.html',
    '/daily/daily.js',
    '/settings/index.html',
    '/settings/settings.js',
    '/studio/index.html',
    '/studio/studio.css',
    '/studio/studio.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => {
            if (key !== CACHE_NAME) return caches.delete(key);
        })))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
