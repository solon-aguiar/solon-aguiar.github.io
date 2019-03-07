var CACHE_NAME = 'v1';
var URLS_TO_CACHE = [
  '/',
  '/about/',
  '/assets/main.css',
  '/assets/images/aboutMe.gif'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return reponse;
          }

          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache){
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
