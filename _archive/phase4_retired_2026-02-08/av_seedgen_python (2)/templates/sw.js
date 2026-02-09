/* Cache-first Service Worker
   Bump CACHE version to force refresh.
*/
const CACHE = "{CACHE_NAME}";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./PROMPTS.md",
  "./deploy_github_pages.md",
  "./assets/favicon.svg",
  "./assets/hero.jpg",
  "./assets/paper.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy));
      return res;
    }).catch(() => cached))
  );
});
