
const CACHE_NAME = 'ev-charge-v2';
// 只预缓存本地已知资源，避免跨域请求导致安装失败
const PRE_CACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 对于 CDN 资源，采用网络优先，失败后尝试缓存
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果请求成功且是 GET，存入缓存
        if (response && response.status === 200 && event.request.method === 'GET') {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败时尝试从缓存读取
        return caches.match(event.request);
      })
  );
});
