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
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
