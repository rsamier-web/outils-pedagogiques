// Service worker de « Symbole commun · Asuna » : l'application fonctionne hors ligne
// après la première visite. Fichier généré par source/build.mjs (ne pas modifier à la main).
const VERSION = 'sc-asuna-mwqerclr';
const FICHIERS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './img/amethyste.webp',
  './img/aubergine.webp',
  './img/banane.webp',
  './img/betterave.webp',
  './img/bougie.webp',
  './img/brocoli.webp',
  './img/carotte.webp',
  './img/cepe.webp',
  './img/chou.webp',
  './img/citron.webp',
  './img/coffre.webp',
  './img/concombre.webp',
  './img/coquelicot.webp',
  './img/crane-bougie.webp',
  './img/cuisse-poulet.webp',
  './img/diamant.webp',
  './img/echelle.webp',
  './img/epee-diamant.webp',
  './img/epouvantail.webp',
  './img/filet.webp',
  './img/fraise.webp',
  './img/gateau-fraises.webp',
  './img/girolles.webp',
  './img/guimauves.webp',
  './img/hippocampe.webp',
  './img/huitres.webp',
  './img/iris.webp',
  './img/lasso.webp',
  './img/lingot-or.webp',
  './img/livre.webp',
  './img/mais.webp',
  './img/maki.webp',
  './img/meduse.webp',
  './img/noix-de-coco.webp',
  './img/oeuf-au-plat.webp',
  './img/oeuf.webp',
  './img/oignon.webp',
  './img/onigiri.webp',
  './img/pain-d-epices.webp',
  './img/pain.webp',
  './img/papillon.webp',
  './img/piment.webp',
  './img/pioche-cristal.webp',
  './img/piranha.webp',
  './img/plume.webp',
  './img/poivron.webp',
  './img/pomme.webp',
  './img/seau-eau.webp',
  './img/seau-lait.webp',
  './img/selle.webp',
  './img/soupe-tomate.webp',
  './img/steak.webp',
  './img/sucre-d-orge.webp',
  './img/sushi.webp',
  './img/tnt.webp',
  './img/tomate.webp',
  './img/torche.webp'
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
