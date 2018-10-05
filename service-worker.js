const cacheName = 'msacs-planner'

const filesToCache = [
  '/',
  '/index.html',
  '/js/main.js',
  '/js/data/bscs00_unscheduled.js',
  '/js/data/bscs01.js',
  '/js/data/bscs99_default.js',
  '/js/data/termList.js',
  '/css/main.css'
]

self.addEventListener('install', function (e) {
  console.log('Starting [ServiceWorker] install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('  [ServiceWorker] caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// activate is fired when worker starts up
self.addEventListener('activate', function (e) {
  console.log('Starting [ServiceWorker] activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName ) {
          console.log('  [ServiceWorker] removing old cache', key)
          return caches.delete(key)
        }
      }));
    })
  );
  // fix corner case and enable faster activation
  return self.clients.claim();
});

// serve the app shell from the cache
self.addEventListener('fetch', function (e) {
  console.log('Starting [ServiceWorker] fetch');
  /*
   * The app is asking for app shell files. In this scenario the app uses the
   * "Cache, falling back to the network" offline strategy:
   * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
   */
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request)
    })
  );

});