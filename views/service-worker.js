(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // package.json
  var version;
  var init_package = __esm({
    "package.json"() {
      version = "1.3.0";
    }
  });

  // src/ts/service-worker.ts
  var require_service_worker = __commonJS({
    "src/ts/service-worker.ts"(exports) {
      init_package();
      var CACHE_NAME = `malazan-cache-${version}`;
      var CACHE_URLS = [
        `/static/css/main-dist.css?v=${new Date().getTime()}`,
        `/static/js/main.js?v=${new Date().getTime()}`,
        `/data.json?v=${new Date().getTime()}`,
        `/manifest.json?v=${new Date().getTime()}`
      ];
      self.addEventListener("install", (event) => {
        const preCache = () => __async(exports, null, function* () {
          const cache = yield caches.open(CACHE_NAME);
          return Promise.all(CACHE_URLS.map((url) => __async(exports, null, function* () {
            const existingCache = yield cache.match(url, { ignoreSearch: true });
            if (existingCache) {
              yield cache.delete(url, { ignoreSearch: true });
              return yield cache.add(url);
            }
            return yield cache.add(url);
          })));
        });
        self.skipWaiting();
        event.waitUntil(preCache());
      });
      self.addEventListener("activate", (event) => {
        self.clients.claim();
        event.waitUntil(caches.keys().then((cacheNames) => {
          return Promise.all(cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
            return;
          }));
        }));
      });
      self.addEventListener("fetch", (event) => {
        event.respondWith(caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request, { ignoreSearch: true }).then((cacheResponse) => {
            return cacheResponse || fetch(event.request).then((fetchResponse) => {
              if (event.request.method === "GET" && (event.request.destination === "image" || event.request.mode === "navigate")) {
                cache.put(event.request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
        }));
      });
    }
  });
  require_service_worker();
})();
