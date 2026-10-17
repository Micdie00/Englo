// Service Worker: macht die App offline-fähig.
// Bei jeder Änderung an der App VERSION erhöhen, damit Geräte das Update bekommen.
const VERSION = 'v1.0.0';
const CACHE = 'englisch-' + VERSION;

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './config.js',
  './css/style.css',
  './js/app.js',
  './js/check.js',
  './js/content.js',
  './js/session.js',
  './js/speech.js',
  './js/store.js',
  './js/sync.js',
  './js/data/vocab.js',
  './js/data/grammar.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase & CDN direkt übers Netz
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' && await cache.match('./index.html'));
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return new Response('Offline', { status: 503 });
    }
  })());
});
