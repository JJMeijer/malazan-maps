/// <reference lib="webworker" />

import { version } from '../../package.json';

const CACHE_NAME = `malazan-cache-${version}`;
const CACHE_URLS = [
    `/static/css/main-dist.css?v=${new Date().getTime()}`,
    `/static/js/search.js?v=${new Date().getTime()}`,
    `/static/js/map.js?v=${new Date().getTime()}`,
    `/data.json?v=${new Date().getTime()}`,
    `/manifest.json?v=${new Date().getTime()}`,
];

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
    self.skipWaiting();

    const preCache = async () => {
        const cache = await caches.open(CACHE_NAME);

        return Promise.all(
            CACHE_URLS.map(async (url) => {
                const existingCache = cache.match(url, { ignoreSearch: true });

                if (existingCache) {
                    await cache.delete(url, { ignoreSearch: true });
                    return await cache.add(url);
                }

                return await cache.add(url);
            }),
        );
    };

    event.waitUntil(preCache());
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
