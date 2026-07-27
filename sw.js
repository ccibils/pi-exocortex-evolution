const CACHE = "pi-exocortex-evolution-03355b09a00fcf09fc26ab9d7e6c0e306a07c048d1df501483505493ca996547";
const PRECACHE = [
  "./story-03355b09a00fcf09fc26ab9d7e6c0e306a07c048d1df501483505493ca996547.html",
  "./receipt-311a59379586e6e547ccebdbc6f25c00ee681f68081bba1210de0deb0ed5477b.json",
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
