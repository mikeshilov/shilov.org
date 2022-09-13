// updating the sw: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

const staticCacheName = 'cmd-v4';
const assets = [
    '/',
    '/jquery.js',
    '/spark-md5.min.js',
    '/styles.css',
    '/utils.js',
    '/modules/main.js',
    '/modules/storage.js',
    '/modules/sync.js',
    '/modules/ui.js',
    '/modules/apps/misc.js',
    '/modules/apps/notes.js',
    '/img/pen.svg',
    '/img/trash.svg'
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
        evt.respondWith(caches.match('/'))
        return
    }
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => cacheRes || fetch(evt.request))
    );
});