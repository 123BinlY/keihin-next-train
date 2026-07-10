const CACHE_NAME = "keihin-next-v2";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./app.js",
  "./manifest.json"
];

// 安裝新版本，預先保存必要檔案
self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// 啟用新版本時，刪除 v1 等舊 Cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 優先讀取目前版本 Cache；沒有才從網絡下載
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(event.request);

      if (
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === "basic"
      ) {
        cache.put(event.request, networkResponse.clone());
      }

      return networkResponse;
    })
  );
});
