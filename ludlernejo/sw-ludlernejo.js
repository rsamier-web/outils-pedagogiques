// Servolaboristo de Ludlernejo: la aplikaĵo funkcias senkonekte post la unua vizito.
// Ŝanĝu VERSIO ĉe ĉiu ĝisdatigo de index.html, por ke la instalitaj aparatoj ricevu la novan version.
const VERSIO = 'ludlernejo-v2';
const KERNO = ['./', './index.html', './manifest-ludlernejo.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIO).then(c => c.addAll(KERNO)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('ludlernejo-') && x !== VERSIO).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const tiparo = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !tiparo) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const k = res.clone(); caches.open(VERSIO).then(c => c.put('./index.html', k)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(t => t || fetch(req).then(res => { const k = res.clone(); caches.open(VERSIO).then(c => c.put(req, k)); return res; })));
});
