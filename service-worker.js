const CACHE_NAME = 'qcv-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/editor.html',
    '/login.html',
    '/pay.html',
    '/help.html',
    '/about.html',
    '/terms.html',
    '/privacy.html',
    '/careers.html',
    '/templates.html',
    '/ai.html',
    '/404.html',
    '/components.css',
    '/templates/templates.css',
    '/js/theme.js',
    '/js/lang.js',
    '/js/template-engine.js',
    '/js/cv-analyzer.js',
    '/js/job-matcher.js',
    '/js/site-settings.js',
    '/js/auto-reload.js',
    '/js/analytics.js',
    '/js/notify-sounds.js',
    '/js/tutorial.js',
    '/js/maintenance.js',
    'https://i.postimg.cc/L59BQSvq/qcv-app-icon-final.png'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(STATIC_ASSETS).catch(function(err) {
                console.log('SW: Some assets failed to cache:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) { return name !== CACHE_NAME; })
                     .map(function(name) { return caches.delete(name); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    var url = new URL(e.request.url);

    // Don't cache Firebase, API calls, or external scripts
    if(url.hostname.includes('firebaseio.com') ||
       url.hostname.includes('gstatic.com') ||
       url.hostname.includes('googleapis.com') ||
       url.hostname.includes('api.') ||
       url.hostname.includes('puter.com') ||
       url.hostname.includes('groq.com') ||
       url.hostname.includes('deepseek.com') ||
       url.hostname.includes('openai.com') ||
       url.hostname.includes('openrouter.ai') ||
       url.hostname.includes('bynara.id') ||
       url.hostname.includes('ipify.org') ||
       url.hostname.includes('postimg.cc') ||
       url.hostname.includes('cloudflare.com') ||
       url.pathname.includes('.json') ||
       e.request.method !== 'GET') {
        return;
    }

    e.respondWith(
        caches.match(e.request).then(function(cached) {
            var fetchPromise = fetch(e.request).then(function(response) {
                if(response && response.status === 200 && response.type === 'basic') {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(e.request, clone);
                    });
                }
                return response;
            }).catch(function() {
                return cached;
            });
            return cached || fetchPromise;
        })
    );
});

self.addEventListener('push', function(e) {
    var data = e.data ? e.data.json() : {};
    var title = data.title || 'QCV';
    var body = data.body || 'You have a new notification';
    var url = data.url || '/';

    e.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: 'https://i.postimg.cc/L59BQSvq/qcv-app-icon-final.png',
            badge: 'https://i.postimg.cc/L59BQSvq/qcv-app-icon-final.png',
            data: { url: url },
            vibrate: [200, 100, 200]
        })
    );
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    var url = e.notification.data.url || '/';
    e.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            for(var i = 0; i < clientList.length; i++) {
                if(clientList[i].url.includes(url) && 'focus' in clientList[i]) {
                    return clientList[i].focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
