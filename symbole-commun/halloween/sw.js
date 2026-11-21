// Service worker de « Symbole commun · Halloween » : l'application fonctionne hors ligne
// après la première visite. Fichier généré par source/build.mjs (ne pas modifier à la main).
const VERSION = 'sc-halloween-mwqd0ouq';
const FICHIERS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './img/ange.webp',
  './img/araignee.webp',
  './img/aubergine.webp',
  './img/balai.webp',
  './img/bonbons.webp',
  './img/bouche.webp',
  './img/bougie.webp',
  './img/cachette.webp',
  './img/cage.webp',
  './img/cauchemar.webp',
  './img/champignon.webp',
  './img/chapeau.webp',
  './img/chat.webp',
  './img/chateau.webp',
  './img/chaudron.webp',
  './img/chauve-souris.webp',
  './img/chemin.webp',
  './img/cheminee.webp',
  './img/chocolat.webp',
  './img/chouette.webp',
  './img/chuchoter.webp',
  './img/citrouille.webp',
  './img/cloche.webp',
  './img/corbeau.webp',
  './img/courgette.webp',
  './img/crane.webp',
  './img/crochet.webp',
  './img/danger.webp',
  './img/epouvantail.webp',
  './img/fantome.webp',
  './img/geant.webp',
  './img/hache.webp',
  './img/jupe.webp',
  './img/loup-garou.webp',
  './img/lune.webp',
  './img/magicien.webp',
  './img/maquillage.webp',
  './img/masque.webp',
  './img/melanger.webp',
  './img/momie.webp',
  './img/monstre.webp',
  './img/mouche.webp',
  './img/moustache.webp',
  './img/nuage.webp',
  './img/orage.webp',
  './img/orange.webp',
  './img/page.webp',
  './img/pyjama.webp',
  './img/rat.webp',
  './img/rouge.webp',
  './img/rugir.webp',
  './img/sorciere.webp',
  './img/squelette.webp',
  './img/toile.webp',
  './img/tombe.webp',
  './img/vampire.webp',
  './img/visage.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k.startsWith('sc-halloween-') && k !== VERSION).map((k) => caches.delete(k))))
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
