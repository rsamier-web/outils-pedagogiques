# Symbole commun · Mineclonia

Adresse : https://rsamier-web.github.io/outils-pedagogiques/symbole-commun/mineclonia/

Jeu du symbole commun (principe du Dobble) : deux cartes rondes de 8 images, une seule image commune.
Le joueur clique sur l'image commune sur chacune des deux cartes. 57 images de Mineclonia :
outils et armes, nourriture, objets, minerais, blocs et créatures, avec leur nom français officiel du jeu.

- Application installable (PWA) avec Chrome sur ordinateur et téléphone, fonctionne hors ligne après la première visite.
- Génération des cartes : plan projectif d'ordre 7 (57 symboles, 57 cartes, 8 symboles par carte).
- Images : textures 16 px lissées avec l'algorithme xBRZ (contours nets et arrondis) puis rendues en 320 px ; blocs et têtes de créatures en vue isométrique.
- Options : lecture du nom à voix haute, images inclinées. Imagier des 57 images et bilan de fin de partie.

Modifier le code : `source/src/` puis, dans `source/`, `npm install` et `node build.mjs`
(régénère `index.html` et `sw.js`).

## Licence des images
Textures de Mineclonia (https://codeberg.org/mineclonia/mineclonia), basées sur Pixel Perfection de XSSheep
et Pixel Perfection Legacy de Nova Wostra, licence CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
Les images de ce dossier (lissées avec xBRZ, blocs et têtes mis en perspective) sont diffusées sous la même licence.
Mineclonia est un jeu libre non officiel, sans lien avec Mojang.
