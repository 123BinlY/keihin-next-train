const CACHE_NAME = "keihin-next-v1";
const FILES = ["./", "index.html", "style.css", "data.js", "app.js", "manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
