const CACHE_NAME = 'malazan-cache-v8';
const CACHE_URLS = [
    '/static/css/main-dist.css',
    '/static/js/search.js',
    '/static/js/map.js',
    '/data.json',
    '/manifest.json',
];

self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        }),
    );
});

self.addEventListener('activate', (event) => {
    self.clients.claim();

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cacheResponse) => {
                return (
                    cacheResponse ||
                    fetch(event.request).then((fetchResponse) => {
                        if (
                            event.request.method === 'GET' &&
                            (event.request.destination === 'image' ||
                                event.request.mode === 'navigate')
                        ) {
                            cache.put(event.request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    })
                );
            });
        }),
    );
});
