const CACHE_NAME = "calculadora-combustivel-v1";
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/service-worker.js",
    "/Imagens/imagem1.jpg",
    "/Imagens/imagem2.jpg",
    "/Imagens/imagem3.jpg",
    "/Imagens/imagem4.jpg",
    "/Imagens/imagem5.jpg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => cache !== CACHE_NAME).map(cache => caches.delete(cache))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
