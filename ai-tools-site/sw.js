/* AI Tools Directory - Service Worker v1.0 */

var CACHE_NAME = 'ai-tools-cache-v1';
var STATIC_ASSETS = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/favicon.svg',
  '/manifest.json',
  '/offline.html',
  '/images/icons/icon-192.svg',
  '/images/icons/icon-512.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

function isHtmlRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('Accept') &&
     request.headers.get('Accept').indexOf('text/html') !== -1);
}

function isStaticAsset(url) {
  return /\.(css|js|svg|png|jpg|jpeg|gif|ico|woff2?|ttf|eot)$/i.test(url);
}

self.addEventListener('fetch', function(event) {
  var request = event.request;

  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(request).then(function(cached) {
          return cached || caches.match('/offline.html');
        });
      })
    );
    return;
  }

  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        return cached || fetch(request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function(cached) {
      return cached || fetch(request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, clone);
        });
        return response;
      });
    }).catch(function() {
      if (isHtmlRequest(request)) return caches.match('/offline.html');
      return new Response('Offline', { status: 503 });
    })
  );
});
