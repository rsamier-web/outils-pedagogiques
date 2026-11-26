# Comprendre les textes : application installable

Adresse : https://rsamier-web.github.io/outils-pedagogiques/comprehension-lecture/

Entraînement à la compréhension de texte et aux inférences (cadre TACIT, Université Rennes 2) :
13 fiches réparties en 4 paliers (Découvrir, S’entraîner, Approfondir, Expert), sans référence à un niveau scolaire.
Chaque fiche se fait en deux séances (A, puis B le lendemain), écran par écran, avec le texte toujours visible
à côté de la question, des coups de pouce qui diminuent d’un palier à l’autre, la chasse à l’intrus,
des rappels espacés sans le texte, de courtes productions écrites et un suivi détaillé pour l’adulte.
Conception : théorie de la charge cognitive et principes de l’apprentissage multimédia (aucune image, aucun chronomètre).

Version pour un seul élève. L’outil avec profils, pour l’enseignant ou l’orthophoniste, est à la racine :
comprehension_lecture.html (https://rsamier-web.github.io/outils-pedagogiques/comprehension_lecture.html).
Les deux applications sont indépendantes : chacune garde ses données dans son navigateur.

Affichage : Andika, Atkinson Hyperlegible ou Lexend ; taille 16 à 30 px ; interligne 1,4 à 2,2 ; espacement élargi.
Synthèse vocale (Web Speech API, gratuite) : Lire la page, Pause/Reprendre, Arrêter ; lecture phrase par phrase,
phrase et mot surlignés (désactivable) ; clic sur un mot pour l’entendre (ou la phrase) ; choix de la voix française,
vitesse, hauteur, volume, Tester la voix ; option « Passer seul à la page suivante ».
Avec les voix Google en ligne, Chrome ne signale pas toujours le mot prononcé : le surlignage du mot est alors estimé.

Installation dans Chrome :
- Ordinateur : bouton « Installer » dans la barre d’outils de l’application, ou icône d’installation dans la barre d’adresse.
- Android : menu ⋮ → « Installer l’application » ou « Ajouter à l’écran d’accueil ».

Une fois installée, l’application fonctionne hors ligne (les voix Google ont besoin d’Internet ;
sans connexion, une voix de l’appareil prend le relais).

Modifier les fiches : éditer source/src/fiches.js, puis dans source/ :
  npm install
  node build.mjs && cp dist/index.html ../index.html && cp dist/enseignant.html ../../comprehension_lecture.html
puis changer VERSION en haut de sw-comprehension.js (par exemple comprehension-v2) pour que les appareils installés se mettent à jour.
