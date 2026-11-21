// Service worker de « Symbole commun · Asuna » : l'application fonctionne hors ligne
// après la première visite. Fichier généré par source/build.mjs (ne pas modifier à la main).
const VERSION = '/*VERSION*/';
const FICHIERS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  /*IMAGES*/
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k.startsWith('sc-asuna-') && k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Page : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => {
      const copie = res.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copie)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  // Images et icônes : cache d'abord.
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    const copie = res.clone(); caches.open(VERSION).then((c) => c.put(req, copie)); return res;
  })));
});
