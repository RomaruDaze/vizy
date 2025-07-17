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