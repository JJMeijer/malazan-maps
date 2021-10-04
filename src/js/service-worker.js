import { version } from '../../package.json';

const CACHE_NAME = `malazan-cache-${version}`;
const CACHE_URLS = [
    `/static/css/main-dist.css?v=${new Date().getTime()}`,
    `/static/js/search.js?v=${new Date().getTime()}`,
    `/static/js/map.js?v=${new Date().getTime()}`,
    `/data.json?v=${new Date().getTime()}`,
    `/manifest.json?v=${new Date().getTime()}`,
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
            return cache.match(event.request, { ignoreSearch: true }).then((cacheResponse) => {
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
