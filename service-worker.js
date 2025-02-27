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

// Cache a resposta e caia para a rede se não houver no cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                // Se o recurso estiver no cache, use ele
                return response;
            }
            // Caso contrário, faça a requisição de rede
            return fetch(event.request).then(networkResponse => {
                // Se a resposta da rede for válida, coloque no cache
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Caso a rede falhe, se você precisar de um fallback (como uma página offline), pode adicionar aqui
                return caches.match('/offline.html'); // Exemplo de fallback
            });
        })
    );
});
