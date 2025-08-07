const CACHE_NAME = 'vizy-app-simple-v1';

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    // Only handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/index.html');
            })
        );
    }
});
