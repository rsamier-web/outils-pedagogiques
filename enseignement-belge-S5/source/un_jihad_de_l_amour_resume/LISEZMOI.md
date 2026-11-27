# Un jihad de l’amour · Schéma et résumé (français S5)

Sources de l’application `enseignement-belge-S5/un_jihad_de_l_amour_resume.html` (React, un seul fichier HTML autonome)
et de sa version texte pour les assistants IA `un_jihad_de_l_amour_resume_contexte_ia.txt`.

## Reconstruire

```bash
npm install
node build.mjs            # écrit ../../un_jihad_de_l_amour_resume.html et ../../un_jihad_de_l_amour_resume_contexte_ia.txt
```

## Contenu (`src/content/`)

- `methode.js` : leçons de méthode (fiches p. 78 et p. 86 du cours)
- `livrecours.js`, `livre.js` : analyse du livre (fiche, mouvements, fragments, traductions, schéma de référence, résumés modèles)
- `textes.js` : textes argumentatifs d’entraînement (auteurs fictifs) avec rôle de chaque phrase, schéma et résumé corrigés
- `exercices.js` : familles d’exercices de complexité croissante
- `themes.js` : bibliothèque de thèmes et d’arguments fréquents
- `glossaire.js`, `flashcards.js`, `quiz.js`, `evaluations.js`, `prompts.js` (consigne pour un retour d’IA)

Le livre n’est pas reproduit : l’analyse a été faite à partir des éditions néerlandaise et anglaise, et tout est reformulé.
