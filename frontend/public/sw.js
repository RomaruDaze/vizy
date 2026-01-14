// Get the correct base path for assets
const getBasePath = () => {
    // Check if we're in production
    const hostname = self.location.hostname;
    // Netlify deployment
    if (hostname === 'vizy-app.netlify.app' || hostname.includes('netlify.app')) {
        return '/vizy';
    }
    // GitHub Pages deployment
    if (hostname === 'romarudaze.github.io') {
        return '/vizy';
    }
    // Check if pathname starts with /vizy (for any deployment)
    if (self.location.pathname.startsWith('/vizy')) {
        return '/vizy';
    }
    return '';
};

const basePath = getBasePath();

self.addEventListener('push', function (event) {
    const options = {
        body: event.data ? event.data.text() : 'Test notification from Vizy!',
        icon: `${basePath}/vizy.png`,
        badge: `${basePath}/vizy.svg`,
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: `${basePath}/vizy.png`
            },
            {
                action: 'close',
                title: 'Close',
                icon: `${basePath}/vizy.png`
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Vizy Notification', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow(`${basePath}/`)
        );
    }
});

const CACHE_NAME = 'vizy-app-v1';
const CACHE_VERSION = 'v1';

self.addEventListener('install', event => {
    console.log('Service Worker installing...', CACHE_VERSION);
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...', CACHE_VERSION);
    event.waitUntil(
        Promise.all([
            // Take control of all clients immediately
            self.clients.claim(),
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
        ])
    );
});

self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Don't intercept module requests or assets during development
    if (event.request.url.includes('/@vite/') ||
        event.request.url.includes('/node_modules/') ||
        event.request.destination === 'script' ||
        event.request.destination === 'style' ||
        event.request.destination === 'image' ||
        event.request.destination === 'font' ||
        event.request.url.includes('.js') ||
        event.request.url.includes('.css') ||
        event.request.url.includes('.svg') ||
        event.request.url.includes('.png') ||
        event.request.url.includes('.jpg') ||
        event.request.url.includes('.ico')) {
        return;
    }

    // Only handle navigation requests (HTML pages)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the response for offline use
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            })
                            .catch(error => {
                                console.error('Error caching response:', error);
                            });
                    }
                    return response;
                })
                .catch(error => {
                    console.error('Fetch failed, trying cache:', error);
                    // Return cached version if network fails
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Fallback to index.html for SPA routing
                            const basePath = getBasePath();
                            const indexPath = basePath ? `${basePath}/index.html` : '/index.html';
                            return caches.match(indexPath)
                                .then(indexResponse => {
                                    if (indexResponse) {
                                        return indexResponse;
                                    }
                                    // Last resort: return a basic offline page
                                    return new Response('Offline', {
                                        status: 503,
                                        statusText: 'Service Unavailable',
                                        headers: new Headers({
                                            'Content-Type': 'text/plain'
                                        })
                                    });
                                });
                        });
                })
        );
    }
});