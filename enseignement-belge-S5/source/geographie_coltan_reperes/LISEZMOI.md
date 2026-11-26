# Géographie S5 · Le coltan en RDC et les repères spatiaux

Sources de l'application `enseignement-belge-S5/geographie_coltan_reperes.html` (React, un seul fichier HTML autonome).

## Reconstruire

```bash
npm install
node build.mjs            # écrit ../../geographie_coltan_reperes.html
```

## Contenu

- `src/content/cours.js` : leçons (pages courtes, texte + carte ou schéma, « À retenir », question de vérification)
- `src/content/glossaire.js` : glossaire (définition simple + exemple)
- `src/content/flashcards.js` : paquets de cartes mémoire (vocabulaire, notions, cartes)
- `src/content/quiz.js`, `exercices.js`, `evaluations.js`
- `src/scenes.js` : cartes interactives ; `src/maps.json` : tracés SVG déjà projetés

## Cartes

`gen_maps.py` produit `src/maps.json` à partir des fichiers GeoJSON de Natural Earth (domaine public),
téléchargés depuis https://github.com/nvkelso/natural-earth-vector (dossier `geojson/`).
Les zones thématiques (climats, végétation, régions naturelles, ressources de la RDC…) sont des schémas
simplifiés dessinés d'après les fiches du cours : leurs limites sont approximatives.

```bash
pip install shapely
python3 gen_maps.py src/maps.json   # adapter le chemin G en tête de fichier
```
