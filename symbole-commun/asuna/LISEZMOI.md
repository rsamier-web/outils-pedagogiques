# Symbole commun · Asuna

Adresse : https://rsamier-web.github.io/outils-pedagogiques/symbole-commun/asuna/

Jeu du symbole commun (principe du Dobble) : deux cartes rondes de 8 images, une seule image commune.
Le joueur clique sur l'image commune sur chacune des deux cartes. 57 images du jeu Asuna (Luanti) :
fruits et légumes, cuisine, nature et animaux, objets, trésors et blocs.

- Application installable (PWA) avec Chrome sur ordinateur et téléphone, fonctionne hors ligne après la première visite.
- Génération des cartes : plan projectif d'ordre 7 (57 symboles, 57 cartes, 8 symboles par carte).
- Images : textures 16 ou 32 px du jeu, lissées avec l'algorithme xBRZ puis rendues en 320 px
  (Asuna ne fournit ni SVG ni textures haute définition) ; coffre et TNT en vue isométrique.
- Options : lecture du nom à voix haute, images inclinées. Imagier des 57 images et bilan de fin de partie.

Modifier le code : `source/src/` puis, dans `source/`, `npm install` et `node build.mjs`
(régénère `index.html` et `sw.js`).

## Licences des images
Textures tirées du jeu Asuna d'EmptyStar (https://github.com/EmptyStar/asuna) et de ses mods :
- Ethereal (TenPlus1) : CC0 / MIT — banane, citron, fraise, noix de coco, maki, sushi, poissons, bougie, pioche en cristal.
- Better Farming : MIT — légumes, onigiri, pain d'épices, sucre d'orge, guimauves, gâteau aux fraises.
- Animalia (ElCeejo) : MIT — œufs, plume, poulet, steak, lasso, filet, selle, seau de lait.
- Marinara (Liil/Wilhelmine/Skandarella) : MIT — huîtres.
- Herbs : GPL 3.0 — cèpe, girolles, coquelicot, iris.
- Everness (SaKeL) : LGPL 2.1 — crâne à bougie.
- Soup : MPL 2.0 — soupe de tomate.
- Biomes : CC BY-SA — épouvantail. Geodes : CC BY-SA 3.0 — améthyste.
- Minetest Game : CC BY-SA 3.0 — pomme, pain, papillon, épée, torche, livre, seau d'eau, échelle, diamant, lingot d'or, coffre, TNT.
Les images retravaillées de ce dossier sont diffusées sous les mêmes licences (CC BY-SA 3.0 pour l'ensemble).
