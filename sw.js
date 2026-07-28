const CACHE = "pi-exocortex-evolution-29b981ff67adc60e2d12391d7a8368c41facf0bc11ba671e62780dfea94cdc3c";
const PRECACHE = [
  "./story-29b981ff67adc60e2d12391d7a8368c41facf0bc11ba671e62780dfea94cdc3c.html",
  "./receipt-f8133db767c84094510fd5c3cd1a8da05c73dc327d9bf34b6891d8742cb388c9.json",
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
