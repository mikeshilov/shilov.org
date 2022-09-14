// updating the sw: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

const staticCacheName = 'cmd-v7';
const assets = [
    '/cmd/',
    '/cmd/jquery.js',
    '/cmd/spark-md5.min.js',
    '/cmd/styles.css',
    '/cmd/utils.js',
    '/cmd/modules/main.js',
    '/cmd/modules/storage.js',
    '/cmd/modules/sync.js',
    '/cmd/modules/ui.js',
    '/cmd/modules/apps/misc.js',
    '/cmd/modules/apps/notes.js',
    '/cmd/img/pen.svg',
    '/cmd/img/trash.svg'
];

// install event
self.addEventListener('install', evt => {
    self.skipWaiting().then();
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('cache opened');
            return cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', async evt => {
    // after we've taken over, iterate over all the current clients (windows)
    const tabs = await self.clients.matchAll({type: 'window'})
    tabs.forEach((tab) => {
        // ...and refresh each one of them
        tab.navigate(tab.url)
    })
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== staticCacheName).map(key => caches.delete(key)));
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    if (!/\.(gif|jpe?g|png|css|js|svg|ico|xml|json|php|bin|map|webmanifest)$/.test(evt.request.url)) {
        evt.respondWith(caches.match('/cmd/'))
        return
    }
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => cacheRes || fetch(evt.request))
    );
});