// updating the sw: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

// install event
self.addEventListener('install', evt => self.skipWaiting().then());

// activate event
self.addEventListener('activate', async evt => {
    (await self.clients.matchAll({type: 'window'})).forEach((tab) => tab.navigate(tab.url))
});

// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(fetch(evt.request));
});