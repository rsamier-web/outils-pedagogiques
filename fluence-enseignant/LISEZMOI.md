# Fluence de lecture · enseignant : application avec profils d'élèves

Adresse : https://rsamier-web.github.io/outils-pedagogiques/fluence-enseignant/

Réunit les deux applications de fluence (fluence-lecture/ et fluence-college/) dans un seul outil pour l'enseignant :
- un profil par élève (prénom + série de textes : cycle 3 « Aventures dans un monde de blocs » ou collège « Carnets du monde ») ;
- pour chaque élève : réglages d'affichage et de voix, progression (un texte par semaine, au moins 5 lectures chronométrées),
  série de jours d'entraînement ; changer de série garde la progression de l'autre ;
- « Suivi » : vue de la classe (texte en cours, jours lus, meilleur temps et palier, série, dernière lecture, détail des lectures) ;
- « Élèves » : ajouter, renommer, changer de série, déverrouiller tous les textes, supprimer, exporter / importer une sauvegarde (.json),
  reprendre la progression des applications pour un seul élève enregistrée sur le même appareil.

Mêmes étapes que les applications élèves : 1 Lire page par page, 2 Écouter le texte, 3 Mots à préparer, 4 Lire sans chrono,
5 Lire avec le chrono. Paliers de vitesse en tempos musicaux (largo → presto) sur un dégradé bleu → indigo.
Les données restent dans le navigateur de l'appareil (rien n'est envoyé sur Internet).

Installation dans Chrome : bouton « Installer » de l'application, ou menu ⋮ → « Installer l'application » sur Android.

Modifier les textes : source/src/texts-cycle3.js et source/src/texts-college.js, puis dans source/ :
  npm install react@18 react-dom@18 esbuild @fontsource/andika @fontsource/atkinson-hyperlegible @fontsource/lexend
  node build.mjs && cp dist/index.html ../index.html
puis changer VERSION en haut de sw-fluence.js (par exemple fluence-enseignant-v2).
