// Get the correct base path for assets
const getBasePath = () => {
    // Check if we're in production (GitHub Pages)
    if (self.location.hostname === 'romarudaze.github.io') {
        return '/vizy';
    }
    return '';
};

const basePath = getBasePath();

self.addEventListener('push', function (event) {
    const options = {
        body: event.data ? event.data.text() : 'Test notification from Vizy!',
        icon: `${basePath}/vizy.svg`,
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
                icon: `${basePath}/vizy.svg`
            },
            {
                action: 'close',
                title: 'Close',
                icon: `${basePath}/vizy.svg`
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
const urlsToCache = [
    '/',
    '/index.html'
];

// Files to cache with specific MIME types
const filesToCache = [
    { url: '/', type: 'text/html' },
    { url: '/index.html', type: 'text/html' }
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Only cache HTML files for now
                return cache.addAll(['/', '/index.html']);
            })
    );
});

self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Don't cache API calls or external resources
    if (event.request.url.includes('api.') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('gstatic.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // If both cache and network fail, return a fallback
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
                return new Response('Network error', { status: 408 });
            })
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});