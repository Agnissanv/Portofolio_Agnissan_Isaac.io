const cacheName = 'codeaz-v1';
const assets = [
  '/',
  '/index.html',
  '/blog.html',
  '/css/style.css',
  '/javascript/data.js'
];

// Installation du Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// Intercepter les requêtes pour servir le cache
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});