"use strict";
// updating the sw: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// install event
self.addEventListener('install', evt => self.skipWaiting().then());
// activate event
self.addEventListener('activate', (evt) => __awaiter(void 0, void 0, void 0, function* () {
    (yield self.clients.matchAll({ type: 'window' })).forEach((tab) => tab.navigate(tab.url));
}));
// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(fetch(evt.request));
});
