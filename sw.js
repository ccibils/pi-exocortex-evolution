const CACHE = "pi-exocortex-evolution-88f39a9ad6ae514c1272f5e7d7a3e0c536464b35987c28e3ea4991a5e51b6011";
const PRECACHE = [
  "./story-88f39a9ad6ae514c1272f5e7d7a3e0c536464b35987c28e3ea4991a5e51b6011.html",
  "./receipt-2adb2e386a3fb2002ec094463154b1d58474aab971cb27375192efb26bd27ba4.json",
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
