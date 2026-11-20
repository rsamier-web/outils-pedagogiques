# Fluence de lecture : application installable

Adresse : https://rsamier-web.github.io/outils-pedagogiques/fluence-lecture/

Entraînement à la fluence avec 8 textes inspirés de l'univers des jeux de blocs (un texte par semaine,
au moins 5 lectures chronométrées), synthèse vocale phrase par phrase (Web Speech API), affichage réglable
(Andika, Atkinson Hyperlegible, Lexend), série de jours d'entraînement (5 jours par semaine, 2 jours de repos tolérés).

Installation dans Chrome :
- Ordinateur : bouton « Installer » dans la barre d'outils de l'application, ou icône d'installation dans la barre d'adresse.
- Android : menu ⋮ → « Installer l'application » ou « Ajouter à l'écran d'accueil ».

Une fois installée, l'application fonctionne hors ligne (les voix Google, elles, ont besoin d'Internet ;
sans connexion, une voix de l'appareil prend le relais). Réglages et progression restent sur l'appareil.

Modifier les textes : éditer source/src/texts.js, puis dans source/ :
  npm install react@18 react-dom@18 esbuild @fontsource/andika @fontsource/atkinson-hyperlegible @fontsource/lexend
  node build.mjs && cp dist/index.html ../index.html
puis changer VERSION en haut de sw-fluence.js (par exemple fluence-v2) pour que les appareils installés se mettent à jour.
