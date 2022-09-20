// updating the sw: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

const staticCacheName = 'cmd-v13';

// install event
self.addEventListener('install', evt => {
    self.skipWaiting().then();
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('cache opened');
            return cache.addAll([
                /(.+?\/)sw\.js/.exec(self.location)[1],
                'jquery.js',
                'spark-md5.min.js',
                'styles.css',
                'utils.js',
                'manifest.json',
                'modules/main.js',
                'modules/storage.js',
                'modules/sync.js',
                'modules/ui.js',
                'modules/apps/misc.js',
                'modules/apps/notes.js',
                'img/pen.svg',
                'img/trash.svg',
                'icons/favicon.ico',
                'icons/android-chrome-192x192.png',
                'fonts/fonts.css',
                'fonts/source-code-pro-v22-latin_cyrillic-regular.woff2',
                'fonts/source-code-pro-v22-latin_cyrillic-regular.woff',
                'fonts/source-code-pro-v22-latin_cyrillic-regular.ttf',
                'fonts/source-code-pro-v22-latin_cyrillic-600.woff2',
                'fonts/source-code-pro-v22-latin_cyrillic-600.woff',
                'fonts/source-code-pro-v22-latin_cyrillic-600.ttf'
        ]);
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
    evt.respondWith(caches.match(evt.request).then(cacheRes => cacheRes || fetch(evt.request)));
});