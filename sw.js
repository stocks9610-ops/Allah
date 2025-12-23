
const CACHE_NAME = 'copytrade-recovery-v8';

// SAFETY MODE:
// 1. Delete all previous caches to fix "Blank Screen"
// 2. Do not aggressively cache JS/CSS to prevent stale logic
// 3. Network First strategy

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clear EVERYTHING to ensure fresh load
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Simple Network-First strategy
  // This ensures we always get the live file if available
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback only if offline (optional)
      return new Response("Offline Mode Unavailable - Please Reconnect");
    })
  );
});
