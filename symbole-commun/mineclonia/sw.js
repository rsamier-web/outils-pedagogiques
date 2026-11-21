// Service worker de « Symbole commun · Mineclonia » : l'application fonctionne hors ligne
// après la première visite. Fichier généré par source/build.mjs (ne pas modifier à la main).
const VERSION = 'sc-mineclonia-mwqd0oar';
const FICHIERS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './img/amethyste.webp',
  './img/araignee.webp',
  './img/arc.webp',
  './img/bibliotheque.webp',
  './img/bloc-herbe.webp',
  './img/boule-de-neige.webp',
  './img/boussole.webp',
  './img/canne-a-peche.webp',
  './img/carotte.webp',
  './img/champignon.webp',
  './img/charbon.webp',
  './img/citrouille-lanterne.webp',
  './img/cochon.webp',
  './img/cookie.webp',
  './img/coquelicot.webp',
  './img/creeper.webp',
  './img/diamant.webp',
  './img/emeraude.webp',
  './img/enderman.webp',
  './img/epee-diamant.webp',
  './img/etabli.webp',
  './img/fleche.webp',
  './img/fourneau.webp',
  './img/gateau.webp',
  './img/hache-or.webp',
  './img/lanterne.webp',
  './img/lingot-or.webp',
  './img/lit.webp',
  './img/livre.webp',
  './img/minerai-diamant.webp',
  './img/montre.webp',
  './img/oeuf.webp',
  './img/os.webp',
  './img/pain.webp',
  './img/pasteque.webp',
  './img/pelle-pierre.webp',
  './img/perle-ender.webp',
  './img/pioche-fer.webp',
  './img/plastron.webp',
  './img/plume.webp',
  './img/poisson-clown.webp',
  './img/poisson-globe.webp',
  './img/poisson.webp',
  './img/pomme.webp',
  './img/porte.webp',
  './img/poulet.webp',
  './img/seau-eau.webp',
  './img/seau-lave.webp',
  './img/selle.webp',
  './img/squelette.webp',
  './img/tarte-citrouille.webp',
  './img/tnt.webp',
  './img/torche.webp',
  './img/totem.webp',
  './img/trident.webp',
  './img/vache.webp',
  './img/zombie.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k.startsWith('sc-mineclonia-') && k !== VERSION).map((k) => caches.delete(k))))
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
