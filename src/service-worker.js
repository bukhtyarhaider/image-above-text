const CACHE_NAME = 'image-text-editor-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/assets/logo.png',
  '/src/assets/icon-192x192.png',
  '/src/assets/icon-512x512.png',
  '/src/assets/offline-placeholder.png'
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of clients immediately
});

// Fetch event: Cache dynamic content and provide offline fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle navigation requests (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html') || new Response('Offline', { status: 503 })
      )
    );
    return;
  }

  // Handle images and other assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache dynamically
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache images and other resources
          if (
            request.destination === 'image' ||
            url.pathname.startsWith('/src/assets/')
          ) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback for images if offline
          if (request.destination === 'image') {
            return caches.match('/src/assets/offline-placeholder.png') ||
              new Response('Image unavailable offline', { status: 503 });
          }
          return new Response('Resource unavailable offline', { status: 503 });
        });
    })
  );
});

// Listen for messages from the app to cache uploaded images
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_IMAGE') {
    const imageUrl = event.data.url;
    caches.open(CACHE_NAME).then((cache) => {
      fetch(imageUrl).then((response) => {
        if (response.ok) {
          cache.put(imageUrl, response);
        }
      });
    });
  }
});