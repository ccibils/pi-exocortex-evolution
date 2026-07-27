const CACHE = "pi-exocortex-evolution-deb964431c69510f45636af3bb0b46c9e6798604d6beea9c0d20913d963591f2";
const PRECACHE = [
  "./story-deb964431c69510f45636af3bb0b46c9e6798604d6beea9c0d20913d963591f2.html",
  "./receipt-a5e6f79dc2082f5113936eb643cde5987d74566e7af20b6eb58d1daa176291e4.json",
  "./favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
});
