// Exercices par famille, de complexité croissante (estompage du guidage : on passe d'exemples résolus
// à des tâches partiellement guidées, puis à des tâches complètes).
// Types : tri, marquer, qcm, schema-trous, schema-vide, redaction, defauts, ordre.

export const NIVEAUX = { 1: ["lv1", "Niveau 1 · reconnaître"], 2: ["lv2", "Niveau 2 · appliquer avec aide"], 3: ["lv3", "Niveau 3 · réaliser seul"] };

export const GROUPES = [
  { id: "methode", t: "S’entraîner sur la méthode (textes courts)" },
  { id: "livre", t: "S’entraîner sur Un jihad de l’amour" },
];

export const FAMILLES = [
  // ------------------------------------------------------------------ MÉTHODE
  {
    id: "f1", groupe: "methode", titre: "Reconnaître les éléments", comp: "Texte → schéma",
    but: "Distinguer le thème de la thèse, et l’argument de l’exemple, sur des phrases isolées.",
    methode: ["Thème : un sujet, sans avis (souvent un groupe nominal).", "Thèse : une opinion, une phrase complète.", "Argument : général, il répond à « pourquoi ? ». Exemple : particulier (nom, lieu, date, chiffre)."],
    resolu: {
      consigne: "Classe ces trois phrases : « La mode jetable. » ; « Il faut refuser la mode jetable. » ; « Le Rana Plaza s’est effondré en 2013. »",
      etapes: [
        { t: "1. Je cherche s’il y a un avis", d: "« La mode jetable » ne donne aucun avis : c’est un sujet, donc le thème." },
        { t: "2. Je repère la phrase qui prend position", d: "« Il faut refuser… » exprime une opinion avec « il faut » : c’est la thèse." },
        { t: "3. Je teste « par exemple »", d: "« Par exemple, le Rana Plaza s’est effondré en 2013 » fonctionne, et la phrase contient une date et un lieu précis : c’est un exemple." },
      ],
      reponse: "Thème : la mode jetable. Thèse : il faut refuser la mode jetable. Exemple : l’effondrement du Rana Plaza en 2013 (il illustre l’argument de l’exploitation des travailleurs).",
    },
    items: [
      { id: "f1a", niveau: 1, type: "tri", consigne: "Thème ou thèse ? Classe chaque étiquette.", cats: ["Thème", "Thèse"],
        etiquettes: [["Le vote des jeunes de seize ans", 0], ["Les jeunes de seize ans devraient pouvoir voter", 1], ["L’humour et ses limites", 0], ["On peut rire de tout, mais pas pour humilier", 1], ["La place de l’IA à l’école", 0], ["Interdire l’IA à l’école serait une erreur", 1], ["La réponse à la haine terroriste", 0], ["Il faut répondre à la haine par l’amour", 1]],
        conclusion: "Le thème est un sujet neutre ; la thèse prend position (devraient, il faut, serait une erreur, on peut… mais)." },
      { id: "f1b", niveau: 1, type: "tri", consigne: "Argument, explication ou exemple ? Toutes les phrases viennent de textes différents.", cats: ["Argument", "Explication", "Exemple"],
        etiquettes: [["Les zoos sensibilisent le public.", 0], ["Voir un animal en vrai crée une émotion qui donne envie de protéger la nature.", 1], ["L’oryx d’Arabie a retrouvé le désert grâce à des animaux nés en captivité.", 2], ["La vengeance n’a pas de fin.", 0], ["Chaque représailles en appelle une autre.", 1], ["Les vendettas entre familles ont duré des décennies.", 2], ["Bien utilisée, l’IA peut aider à apprendre.", 0], ["Elle peut réexpliquer une notion autrement, si l’élève fait lui-même le travail.", 1], ["Un élève peut lui demander trois exemples de plus d’une règle de grammaire.", 2]],
        conclusion: "L’argument est la raison générale ; l’explication développe cette raison ; l’exemple est un cas particulier." },
      { id: "f1c", niveau: 2, type: "qcm", q: "« Les grandes marches pour le climat ont montré que de nombreux adolescents se passionnent pour ces questions. » Quel argument cet exemple soutient-il ?", o: ["Les jeunes sont trop influençables.", "Les décisions politiques concernent directement les jeunes, qui s’y intéressent.", "Voter coûte cher.", "Les adultes votent mal."], a: 1, e: "L’exemple montre l’intérêt des jeunes pour des décisions qui les concernent : il illustre l’argument « les décisions politiques concernent directement les jeunes »." },
      { id: "f1d", niveau: 2, type: "qcm", q: "Laquelle de ces phrases est un argument (et non un exemple) ?", o: ["En 2013, un immeuble d’ateliers s’est effondré au Bangladesh.", "Inès a acheté cinq t-shirts samedi.", "La mode jetable repose sur l’exploitation de travailleurs.", "Un jean peut demander plusieurs milliers de litres d’eau."], a: 2, e: "C’est la seule phrase générale qui répond à « pourquoi refuser la mode jetable ? ». Les autres sont des cas particuliers." },
    ],
  },
  {
    id: "f2", groupe: "methode", titre: "Repérer dans un texte", comp: "Texte → schéma",
    but: "Marquer, directement dans le texte, le rôle de chaque phrase. Les textes sont de plus en plus longs et complexes.",
    methode: ["Lis d’abord tout le texte une fois.", "Trouve la thèse en premier (début, fin, marques d’opinion).", "Cherche les connecteurs : ils annoncent souvent le rôle de la phrase.", "Marque ensuite les phrases qui ont une autre fonction (accroche, anecdote, citation)."],
    resolu: {
      consigne: "Observe comment on marque le premier paragraphe du texte sur les zoos.",
      etapes: [
        { t: "1. « Chaque année, des millions de visiteurs… »", d: "Aucun avis, aucune raison : la phrase plante le décor. Autre fonction (accroche)." },
        { t: "2. « Certes, un animal en captivité… »", d: "« Certes » annonce une concession : l’auteur admet une part de l’avis adverse. Contre-argument." },
        { t: "3. « Pourtant, les zoos modernes restent utiles… »", d: "« Pourtant » renverse la concession et l’auteur donne son opinion : thèse." },
      ],
      reponse: "Accroche → concession → thèse : un ordre très fréquent dans les introductions.",
    },
    items: [
      { id: "f2a", niveau: 1, type: "marquer", texte: "t1", roles: ["amorce", "these", "arg", "expl", "ex", "concl"], consigne: "Marque le rôle de chaque phrase du texte « Ranger son téléphone pour mieux apprendre »." },
      { id: "f2b", niveau: 2, type: "marquer", texte: "t2", roles: ["amorce", "these", "arg", "expl", "ex", "contre", "concl"], consigne: "Marque le rôle de chaque phrase du texte « Des zoos pour protéger ». Attention à la concession." },
      { id: "f2c", niveau: 2, type: "marquer", texte: "t3", roles: ["amorce", "these", "arg", "expl", "ex", "contre", "refut", "concl"], consigne: "Marque le rôle de chaque phrase du texte « Voter à seize ans »." },
      { id: "f2d", niveau: 3, type: "marquer", texte: "t4", roles: ["amorce", "these", "arg", "expl", "ex", "contre", "refut", "concl"], consigne: "Marque le rôle de chaque phrase du texte « La mode jetable nous coûte cher ». L’introduction commence par une anecdote." },
      { id: "f2e", niveau: 3, type: "marquer", texte: "t5", roles: ["amorce", "these", "arg", "expl", "ex", "contre", "refut", "concl"], consigne: "Marque le rôle de chaque phrase du texte « Rire de tout, mais pas n’importe comment ». La thèse est nuancée." },
    ],
  },
  {
    id: "f3", groupe: "methode", titre: "Compléter un schéma à trous", comp: "Texte → schéma",
    but: "Compléter des schémas où il manque de plus en plus de cases : l’aide diminue à chaque exercice.",
    methode: ["Relis le texte (ouvre-le à côté du schéma).", "Écris court : un groupe nominal ou une phrase simple.", "Reformule avec tes mots, sans changer le sens."],
    resolu: {
      consigne: "Il manque l’exemple du premier argument dans le schéma du texte sur le téléphone.",
      etapes: [
        { t: "1. Je repère l’argument", d: "Argument 1 : le téléphone empêche de se concentrer." },
        { t: "2. Je cherche le cas concret qui le suit", d: "Après « Par exemple », le texte parle d’un élève qui reçoit trois messages pendant un exercice." },
        { t: "3. Je l’écris en bref", d: "« L’élève qui reçoit trois messages pendant un exercice de mathématiques. »" },
      ],
      reponse: "Exemple de l’argument 1 : l’élève interrompu par trois messages pendant un exercice.",
    },
    items: [
      { id: "f3a", niveau: 1, type: "schema-trous", texte: "t1", trous: ["ex0", "ex1"], consigne: "Complète les deux exemples du schéma." },
      { id: "f3b", niveau: 2, type: "schema-trous", texte: "t2", trous: ["these", "arg1", "expl2", "contre"], consigne: "Complète la thèse, le deuxième argument, l’explication du troisième et la concession." },
      { id: "f3c", niveau: 2, type: "schema-trous", texte: "t3", trous: ["theme", "these", "arg0", "arg1", "contre"], consigne: "Complète le thème, la thèse, les deux arguments et le contre-argument." },
      { id: "f3d", niveau: 3, type: "schema-trous", texte: "t5", trous: ["theme", "these", "arg0", "expl0", "arg1", "ex1", "arg2", "contre"], consigne: "Il ne reste presque rien : complète le schéma du texte sur l’humour." },
    ],
  },
  {
    id: "f4", groupe: "methode", titre: "Construire le schéma complet", comp: "Texte → schéma",
    but: "Réaliser seul le schéma d’un texte inconnu, comme à l’examen.",
    methode: ["Suis la procédure de la page 78, étape par étape.", "Une ligne par argument ; explication et exemple sur la même ligne.", "Contre-argument et réfutation dans la case à part.", "Compare ensuite avec le corrigé : as-tu les mêmes arguments, même formulés autrement ?"],
    resolu: {
      consigne: "Rappel de la procédure, avec le texte « Voter à seize ans ».",
      etapes: [
        { t: "Étapes 1 et 2 : comprendre, thème et thèse", d: "Thème : le vote des jeunes de seize ans. Thèse : il faut leur accorder le droit de vote à toutes les élections." },
        { t: "Étape 3 : autres fonctions", d: "La première phrase (le vote européen de 2024) donne le contexte." },
        { t: "Étape 4 : arguments et exemples", d: "Deux arguments annoncés par « la première raison » et « la seconde raison », chacun avec un exemple ; un contre-argument (« On objecte… ») et sa réfutation (« Mais… »)." },
        { t: "Étape 5 : je trace et je reformule", d: "Je remplis le schéma de A à E en phrases courtes, avec mes mots." },
      ],
      reponse: "Le schéma complet est visible dans la leçon « La méthode du schéma ».",
    },
    items: [
      { id: "f4a", niveau: 2, type: "schema-vide", texte: "t4", consigne: "Construis le schéma complet du texte « La mode jetable nous coûte cher »." },
      { id: "f4b", niveau: 3, type: "schema-vide", texte: "t6", consigne: "Construis le schéma complet du texte « L’intelligence artificielle à l’école »." },
      { id: "f4c", niveau: 3, type: "schema-vide", texte: "t7", consigne: "Construis le schéma complet du texte « Punir sans se venger »." },
    ],
  },
  {
    id: "f5", groupe: "methode", titre: "Hiérarchiser et reformuler", comp: "Texte → schéma",
    but: "Garder l’essentiel, supprimer l’accessoire, et dire la même chose en plus court avec ses mots.",
    methode: ["Essentiel : thèse, arguments, explication principale. Accessoire : anecdotes, exemples, répétitions.", "Raccourcir, généraliser, nominaliser.", "Vérifier que le sens n’a pas changé."],
    resolu: {
      consigne: "Reformule : « Climat, enseignement, logement, emploi : ce sont eux qui vivront le plus longtemps avec les conséquences des choix faits aujourd’hui. »",
      etapes: [
        { t: "1. Je trouve le noyau", d: "Ce sont les jeunes qui vivront le plus longtemps avec les conséquences." },
        { t: "2. Je généralise la liste", d: "« Climat, enseignement, logement, emploi » → « leur avenir »." },
        { t: "3. Je rédige court", d: "« Les choix politiques engagent l’avenir des jeunes. »" },
      ],
      reponse: "Les choix politiques engagent l’avenir des jeunes.",
    },
    items: [
      { id: "f5a", niveau: 1, type: "tri", consigne: "Pour le résumé du texte sur la mode jetable : essentiel ou accessoire ?", cats: ["Essentiel", "Accessoire"],
        etiquettes: [["La mode jetable est un piège qu’il faut refuser.", 0], ["Inès a acheté cinq t-shirts pour le prix d’une pizza.", 1], ["Elle abîme la planète.", 0], ["Un jean peut demander plusieurs milliers de litres d’eau.", 1], ["Elle repose sur l’exploitation de travailleurs.", 0], ["Le Rana Plaza s’est effondré en 2013.", 1], ["L’économie promise est une illusion.", 0], ["Le porterai-je au moins trente fois ?", 1]],
        conclusion: "On garde la thèse et les arguments. Les anecdotes, les chiffres et les questions au lecteur sont accessoires dans un résumé court." },
      { id: "f5b", niveau: 2, type: "qcm", q: "Meilleure reformulation de : « Rire d’une épreuve, c’est reprendre un peu de pouvoir sur elle et se sentir moins seul. »", o: ["Rire d’une épreuve, c’est reprendre un peu de pouvoir sur elle.", "Le rire aide à surmonter les difficultés.", "Il faut toujours rire de tout.", "Les épreuves rendent seul."], a: 1, e: "C’est plus court, avec d’autres mots, et le sens est respecté. La réponse A recopie ; C transforme l’idée ; D fait un contresens." },
      { id: "f5c", niveau: 2, type: "qcm", q: "Quelle nominalisation convient pour une case de schéma : « les élèves se concentrent moins bien » ?", o: ["Les élèves et la concentration", "Baisse de la concentration", "Concentration des élèves meilleure", "Élèves moins"], a: 1, e: "« Baisse de la concentration » transforme la phrase en groupe nominal, sans perdre le sens." },
      { id: "f5d", niveau: 3, type: "qcm", q: "Généralise : « l’école catholique, les musulmans de Damas priant dans une église, Raphaël peignant Averroès ».", o: ["Des lieux de prière", "La fraternité possible entre croyants de religions différentes", "L’histoire de la peinture", "Les écoles religieuses"], a: 1, e: "Ces trois exemples prouvent la même idée générale : des croyants différents peuvent se reconnaître comme frères." },
    ],
  },
  {
    id: "f6", groupe: "methode", titre: "Du schéma au texte argumentatif", comp: "Schéma → texte",
    but: "Faire le chemin inverse : déplier un schéma en paragraphes, puis en texte complet.",
    methode: ["Une ligne du schéma = un paragraphe.", "Argument (connecteur d’énumération) → explication (en effet) → exemple (par exemple) → lien avec la thèse.", "Introduction : accroche + thèse. Conclusion : thèse reformulée + ouverture."],
    resolu: {
      consigne: "Déplie cette ligne : Argument « Les zoos sensibilisent le public » → Explication « voir un animal en vrai crée une émotion » → Exemple « les ateliers pour enfants ».",
      etapes: [
        { t: "1. La phrase-argument", d: "« Deuxièmement, les zoos sensibilisent le public. »" },
        { t: "2. L’explication", d: "« En effet, voir un animal en vrai crée une émotion qu’aucun écran ne remplace, et cette émotion donne envie de protéger la nature. »" },
        { t: "3. L’exemple", d: "« Par exemple, de nombreux parcs organisent des ateliers où les enfants découvrent les menaces qui pèsent sur la forêt tropicale. »" },
        { t: "4. Le lien avec la thèse", d: "« Les zoos peuvent ainsi former de futurs défenseurs de la nature. »" },
      ],
      reponse: "Deuxièmement, les zoos sensibilisent le public. En effet, voir un animal en vrai crée une émotion qu’aucun écran ne remplace, et cette émotion donne envie de protéger la nature. Par exemple, de nombreux parcs organisent des ateliers où les enfants découvrent les menaces qui pèsent sur la forêt tropicale. Les zoos peuvent ainsi former de futurs défenseurs de la nature.",
    },
    items: [
      { id: "f6a", niveau: 1, type: "redaction", max: 80, consigne: "Déplie cette ligne de schéma en un paragraphe : Argument « Le téléphone favorise le cyberharcèlement » → Explication « on peut filmer et diffuser sans accord » → Exemple « une photo prise au vestiaire ».",
        trame: [["arg", "Argument", "De plus, "], ["expl", "Explication", "En effet, "], ["ex", "Exemple", "Par exemple, "], ["lien", "Lien avec la thèse", "C’est pourquoi "]],
        correction: { texte: ["De plus, le téléphone favorise le cyberharcèlement. En effet, il permet de filmer ou de photographier un camarade sans son accord, puis de diffuser l’image en quelques secondes. Par exemple, une photo prise en cachette au vestiaire peut circuler dans toute l’école avant la fin de la journée. C’est pourquoi l’interdire pendant les cours protège les élèves."], criteres: ["Mon paragraphe commence par l’argument, introduit par un connecteur.", "L’explication est introduite par « en effet » ou « car ».", "L’exemple est concret et introduit par « par exemple ».", "La dernière phrase relie l’argument à la thèse."] } },
      { id: "f6b", niveau: 2, type: "redaction", max: 90, consigne: "Rédige un paragraphe qui présente un contre-argument puis le réfute. Sujet : le vote à 16 ans. Contre-argument : « les jeunes manqueraient de maturité ». Réfutation : « la maturité ne dépend pas de l’âge ; l’école peut préparer au vote ».",
        trame: [["contre", "Contre-argument", "Certes, certains estiment que "], ["refut", "Réfutation", "Pourtant, "], ["ex", "Exemple ou précision", "Ainsi, "]],
        correction: { texte: ["Certes, certains estiment qu’à seize ans, les jeunes manqueraient de maturité pour voter. Pourtant, la maturité politique ne dépend pas seulement de l’âge : bien des adultes votent sans s’informer, alors que de nombreux adolescents suivent l’actualité. Ainsi, un cours de citoyenneté qui compare les programmes avant les élections peut préparer les jeunes à voter de façon réfléchie."], criteres: ["Le contre-argument est présenté avec un marqueur (certes, certains estiment…).", "La réfutation commence par un connecteur d’opposition.", "La réfutation donne une vraie raison.", "Une précision ou un exemple appuie la réfutation."] } },
      { id: "f6c", niveau: 3, type: "redaction", max: 250, theme: "uniforme", consigne: "À partir du schéma de la bibliothèque (thème « L’uniforme scolaire », arguments « pour »), rédige un texte argumentatif complet de 200 à 250 mots : introduction, deux ou trois paragraphes d’arguments, un contre-argument réfuté, conclusion.",
        trame: [["intro", "Introduction (accroche + thèse)", ""], ["a1", "Premier argument", "D’abord, "], ["a2", "Deuxième argument", "Ensuite, "], ["contre", "Contre-argument et réfutation", "Certes, "], ["concl", "Conclusion (thèse reformulée + ouverture)", "En somme, "]],
        correction: { texte: ["Pistes de correction : l’introduction amène le thème (par exemple une scène de cour de récréation) et formule clairement la thèse (« l’uniforme devrait être imposé »).", "Chaque argument de la bibliothèque devient un paragraphe : effacer les différences sociales visibles, créer un sentiment d’appartenance, simplifier la vie des familles.", "Le contre-argument « il empêche d’exprimer sa personnalité » peut être réfuté : on peut exprimer sa personnalité autrement (ses idées, ses activités), et l’école n’est pas un défilé de mode.", "La conclusion reprend la thèse et ouvre, par exemple, sur une tenue choisie avec les élèves."], criteres: ["L’introduction contient une accroche et la thèse.", "Chaque argument a son paragraphe, avec explication et exemple.", "Un contre-argument est présenté puis réfuté.", "La conclusion reformule la thèse et ouvre le débat.", "Les connecteurs sont variés et justes."] } },
    ],
  },
  {
    id: "f7", groupe: "methode", titre: "Du schéma au résumé", comp: "Schéma → résumé",
    but: "Rédiger un résumé à partir d’un schéma, en appliquant la fiche page 86.",
    methode: ["Introduction : source (auteur, genre, date) + thème + thèse.", "Un paragraphe ou une phrase par argument, dans l’ordre du schéma, avec un connecteur.", "3e personne, nom de famille de l’auteur, verbes introducteurs précis.", "Pas d’exemples (sauf s’ils sont indispensables), pas d’avis, pas de copie. Compte tes mots."],
    resolu: {
      consigne: "Rédige le résumé du texte « Des zoos pour protéger » en 70 mots maximum, à partir de son schéma.",
      etapes: [
        { t: "1. L’introduction", d: "« Dans une carte blanche, le biologiste Hugo Lambert reconnaît que la captivité n’est pas la vie sauvage, mais il estime que les zoos modernes restent utiles s’ils se consacrent à la protection des animaux. » La concession est intégrée à la thèse." },
        { t: "2. Les arguments, dans l’ordre", d: "« En effet, ils sauvent des espèces menacées grâce à l’élevage et aux réintroductions. De plus, ils sensibilisent le public à la nature. Enfin, ils financent des projets de protection sur le terrain. »" },
        { t: "3. Je vérifie", d: "3e personne, nom de famille, verbes « reconnaît », « estime », aucun exemple (l’oryx a disparu), aucun avis, moins de 70 mots." },
      ],
      reponse: "Dans une carte blanche, le biologiste Hugo Lambert reconnaît que la captivité n’est pas la vie sauvage, mais il estime que les zoos modernes restent utiles s’ils se consacrent à la protection des animaux. En effet, ils sauvent des espèces menacées grâce à l’élevage et aux réintroductions. De plus, ils sensibilisent le public à la nature. Enfin, ils financent des projets de protection sur le terrain.",
    },
    items: [
      { id: "f7a", niveau: 1, type: "ordre", consigne: "Remets dans l’ordre les phrases du résumé du texte « Voter à seize ans ».",
        items: ["Dans un éditorial, Samira Haddad plaide pour que les jeunes de seize ans puissent voter à toutes les élections.", "D’abord, elle souligne que les décisions politiques les concernent directement, puisqu’ils vivront longtemps avec leurs conséquences.", "Ensuite, elle affirme que voter tôt crée une habitude, encouragée par l’école.", "Enfin, elle réfute l’idée que les jeunes seraient trop influençables : les adultes le sont aussi."],
        conclusion: "L’introduction (source + thèse) vient d’abord ; les connecteurs d’abord, ensuite, enfin donnent l’ordre des arguments." },
      { id: "f7b", niveau: 2, type: "qcm", q: "Quelle introduction convient au résumé du texte « Rire de tout, mais pas n’importe comment » ?", o: ["« On peut rire de tout, mais pas avec n’importe qui », disait Desproges.", "Dans un billet d’humeur, Clara Renard soutient qu’on peut rire de tout, pourvu que le rire n’écrase pas les plus faibles.", "Je pense moi aussi qu’on peut rire de tout.", "Clara dit que l’humour c’est bien mais pas toujours."], a: 1, e: "Source (genre + nom complet), verbe précis, thèse reformulée, neutralité. A recopie l’accroche ; C donne un avis ; D utilise le prénom seul et « dit »." },
      { id: "f7c", niveau: 2, type: "redaction", max: 100, texte: "t4", schemaDonne: true, consigne: "À partir du schéma donné, rédige le résumé du texte « La mode jetable nous coûte cher » en 100 mots maximum, pour un lecteur de ton âge qui n’a pas lu le texte.",
        trame: [["intro", "Introduction (source + thème + thèse)", "Dans sa chronique, Thomas Delvaux "], ["a1", "Argument 1", "Premièrement, "], ["a2", "Argument 2", "Deuxièmement, "], ["a3", "Argument 3", "Troisièmement, "], ["contre", "Contre-argument et réfutation", "Le journaliste admet que "]],
        correction: { modele: "t4", criteres: ["L’introduction donne la source, le thème et la thèse.", "Les trois arguments sont présents, dans l’ordre.", "La concession et la réfutation sont mentionnées.", "Aucun exemple (Inès, le jean, le Rana Plaza) n’est repris.", "Le résumé fait 100 mots au maximum."] } },
      { id: "f7d", niveau: 3, type: "redaction", max: 120, texte: "t6", consigne: "Lis le texte « L’intelligence artificielle à l’école », fais son schéma au brouillon, puis rédige son résumé en 120 mots maximum.",
        trame: [["intro", "Introduction", "Dans un texte d’opinion, "], ["a1", "Argument 1", ""], ["a2", "Argument 2", ""], ["a3", "Argument 3", ""], ["refut", "Réfutation du risque de tricherie", ""]],
        correction: { modele: "t6", criteres: ["Source, thème et thèse dans l’introduction.", "La concession (la crainte de la tricherie) est intégrée.", "Les trois arguments sont reformulés.", "La réponse au risque de tricherie est mentionnée.", "120 mots maximum, 3e personne, aucun avis."] } },
    ],
  },
  {
    id: "f8", groupe: "methode", titre: "Évaluer et corriger des résumés", comp: "Résumé → critères",
    but: "Repérer les défauts d’un résumé d’élève, comme à l’activité 5 de ton cours, puis l’améliorer.",
    methode: ["Vérifie la situation de communication : 3e personne, nom de l’auteur, destinataire.", "Vérifie le contenu : thèse et tous les arguments, sans exemples inutiles.", "Vérifie la forme : reformulation, connecteurs, neutralité, nombre de mots."],
    resolu: {
      consigne: "Résumé de Lucas (texte sur le téléphone, 50 mots max) : « Je pense qu’il faut interdire le téléphone. Par exemple, un élève reçoit trois messages pendant un exercice de maths. Laure dit aussi qu’on peut prendre des photos. »",
      etapes: [
        { t: "1. Énonciation", d: "« Je pense » : Lucas n’a pas changé d’énonciateur. « Laure » : prénom seul." },
        { t: "2. Contenu", d: "L’argument de la concentration est remplacé par son exemple ; le cyberharcèlement est à peine évoqué." },
        { t: "3. Forme", d: "Verbe « dit » ; pas de connecteurs logiques ; pas de source." },
      ],
      reponse: "Version corrigée : « Dans sa chronique, Laure Martin soutient que le téléphone portable devrait être interdit pendant les cours. D’une part, il nuit à la concentration, car chaque notification détourne l’attention. D’autre part, son interdiction protège les élèves du cyberharcèlement. »",
    },
    items: [
      { id: "f8a", niveau: 1, type: "defauts", consigne: "Résumé d’Amina (texte « Des zoos pour protéger », 70 mots max). Coche les défauts présents.",
        resume: "Hugo dit que les zoos c’est bien. Il dit que l’oryx d’Arabie a été sauvé grâce à des animaux nés en captivité. Il dit aussi que les enfants font des ateliers sur la forêt tropicale. Moi je trouve qu’il a raison car les animaux sont mignons.",
        options: [["Prénom seul de l’auteur", true], ["Verbe « dire » répété", true], ["Exemples gardés à la place des arguments", true], ["Avis personnel", true], ["Dépassement du nombre de mots", false], ["Thèse absente ou déformée", true]],
        correction: ["Amina écrit « Hugo » au lieu de « Lambert » ou « Hugo Lambert », et répète « il dit ».", "Elle garde deux exemples (l’oryx, les ateliers) au lieu des arguments (sauver des espèces, sensibiliser) et oublie le troisième (financer la protection).", "La thèse est réduite à « les zoos c’est bien » : elle perd la condition (être des lieux de protection) et la concession.", "« Moi je trouve qu’il a raison » est un avis personnel. Le texte fait une cinquantaine de mots : la longueur n’est pas le problème."] },
      { id: "f8b", niveau: 2, type: "defauts", consigne: "Résumé de Yanis (texte « Rire de tout, mais pas n’importe comment », 110 mots max). Coche les défauts présents.",
        resume: "Dans un billet d’humeur, Clara Renard affirme qu’il faut interdire toutes les blagues. Elle explique que l’humour permet de critiquer les puissants et aide à supporter le malheur. Elle ajoute qu’une plaisanterie qui vise quelqu’un pour ce qu’il est l’humilie. Elle conclut que la limite de l’humour est la cible, pas le sujet.",
        options: [["Contresens sur la thèse", true], ["Copie de longues phrases du texte", false], ["Avis personnel", false], ["Absence de connecteurs logiques variés", true], ["Arguments manquants", false], ["Énonciation à la 1re personne", false]],
        correction: ["Grave contresens : l’auteure ne veut pas interdire les blagues ; elle soutient qu’on peut rire de tout, à condition de ne pas écraser les plus faibles.", "Les arguments sont présents et reformulés, mais les liens logiques manquent : « Elle explique », « Elle ajoute », « Elle conclut » ne montrent pas l’opposition (« toutefois ») entre les deux premiers arguments et la réfutation.", "Correction possible de l’introduction : « Dans un billet d’humeur, Clara Renard soutient qu’on peut rire de tout, pourvu que le rire n’écrase pas les plus faibles. »"] },
      { id: "f8c", niveau: 3, type: "defauts", consigne: "Résumé de Sarah (texte « Punir sans se venger », 120 mots max). Coche les défauts présents.",
        resume: "Après un crime terrible, la colère est légitime et certains réclament œil pour œil, dent pour dent. Les vendettas entre familles ont duré des décennies. Lors du procès des attentats de Bruxelles en 2022 et 2023, beaucoup de victimes ont témoigné. En Belgique, des médiations existent entre victimes et auteurs. Certains pensent que la peine de mort dissuade, mais rien ne le prouve.",
        options: [["Pas de source ni d’auteur", true], ["Thèse absente", true], ["Exemples à la place des arguments", true], ["Phrases recopiées du texte", true], ["Avis personnel", false], ["Résumé trop long", false]],
        correction: ["Sarah résume paragraphe par paragraphe en recopiant surtout l’accroche et les exemples : c’est une réduction mécanique.", "Ni l’auteure (Élise Moreau) ni la thèse (la justice doit punir sans devenir vengeance) n’apparaissent.", "Les arguments (la vengeance n’a pas de fin, la justice protège les victimes, la peine doit préparer l’avenir) sont remplacés par leurs exemples.", "Plusieurs phrases reprennent presque mot pour mot le texte."] },
    ],
  },
  // ------------------------------------------------------------------ LIVRE
  {
    id: "l1", groupe: "livre", titre: "La fonction des fragments", comp: "Repérer",
    but: "Distinguer les fragments qui racontent, ceux qui expriment une émotion et ceux qui argumentent (étape 3 de la procédure).",
    methode: ["Récit : des faits datés, des actions (je suis allé, elle a pris le métro).", "Lyrique : des émotions, des images, une adresse à Loubna.", "Argumentatif : une idée générale défendue (il faut, on ne peut pas, rien ne justifie)."],
    resolu: {
      consigne: "Quelle est la fonction du fragment « Ce jour-là » ?",
      etapes: [
        { t: "1. Que contient-il ?", d: "Des phrases très courtes au passé : il était en congé, elle a pris le métro, une amie est venue." },
        { t: "2. Défend-il une idée ?", d: "Non : il ne généralise rien, il n’y a ni « il faut » ni raison." },
        { t: "3. Conclusion", d: "C’est un récit. Il a une autre fonction : émouvoir et montrer d’où l’auteur parle." },
      ],
      reponse: "« Ce jour-là » est un récit : autre fonction que l’argumentation.",
    },
    items: [
      { id: "l1a", niveau: 1, type: "tri", consigne: "Classe ces fragments selon leur fonction dominante.", cats: ["Récit", "Lyrique", "Argumentatif"],
        etiquettes: [["La nuit : il descend l’escalier, sous médicaments, pour donner le biberon.", 0], ["Mes parents : l’immigration de son père depuis le Rif.", 0], ["La rencontre : Loubna entre dans le magasin de téléphones.", 0], ["Lettre à Loubna : « rien n’a plus de goût ».", 1], ["Bonté : portrait-hommage de Loubna.", 1], ["Beauté : le coucher de soleil reste beau.", 1], ["Le Coran : l’axe vertical et l’axe horizontal.", 2], ["La peine de mort : un crime approuvé par la société.", 2], ["Humanité : humain d’abord, musulman ensuite.", 2], ["Jihad : le sens premier du mot est l’effort sur soi.", 2]],
        conclusion: "Récits et textes lyriques ont une autre fonction (émouvoir, rendre l’auteur crédible). Les fragments argumentatifs nourrissent le schéma." },
      { id: "l1b", niveau: 2, type: "qcm", q: "Le fragment « À propos des attentats » ne contient qu’une phrase : le terroriste « le laisse froid ». Quelle est sa fonction ?", o: ["Raconter l’attentat en détail", "Refuser de donner de l’importance au terroriste, ce qui annonce le refus de la haine", "Décrire Loubna", "Définir le jihad"], a: 1, e: "La brièveté est un choix : l’auteur refuse de consacrer des pages au terroriste. C’est une manière de ne pas lui laisser le dernier mot." },
    ],
  },
  {
    id: "l2", groupe: "livre", titre: "Quel argument cet exemple illustre-t-il ?", comp: "Hiérarchiser",
    but: "Rattacher chaque exemple du livre à l’un des cinq arguments : c’est la clé pour généraliser dans le résumé.",
    methode: ["Pour chaque exemple, demande-toi : « qu’est-ce que cela prouve ? ».", "A1 vengeance · A2 sens du jihad · A3 foi et raison · A4 fraternité humaine · A5 diversité et éducation."],
    resolu: {
      consigne: "« Le Prophète, mystique à La Mecque, devenu chef politique à Médine. » Quel argument ?",
      etapes: [
        { t: "1. Que prouve cet exemple ?", d: "Que les textes et les règles dépendent d’un contexte historique : à Médine, le Prophète doit gouverner." },
        { t: "2. À quel argument cela correspond-il ?", d: "Il faut lire la religion avec la raison et replacer les règles dans leur contexte : A3." },
      ],
      reponse: "A3 : une foi éclairée par la raison.",
    },
    items: [
      { id: "l2a", niveau: 2, type: "tri", consigne: "Rattache chaque exemple à son argument.", cats: ["A1 Vengeance", "A2 Jihad", "A3 Foi et raison", "A4 Fraternité", "A5 Diversité"],
        etiquettes: [["Ses fils furieux réclament vengeance.", 0], ["Le conflit israélo-palestinien.", 0], ["Le poème des quatre colombes.", 0], ["La définition du dictionnaire en ouverture.", 1], ["« Ne te mets pas en colère » (hadith).", 1], ["Mère Teresa exclue du paradis ?", 2], ["Bagdad au Xe siècle.", 2], ["Les fidèles qui prient sur l’autoroute pour être vus.", 2], ["Raphaël peint Averroès au Vatican.", 3], ["Les prières venues du monde entier pour Loubna.", 3], ["« Sale Marocain » à six ans.", 4], ["Le Molenbeek des médias, présenté comme Kaboul.", 4], ["La belgitude.", 4]],
        conclusion: "Dans le résumé, on remplace ces exemples par l’argument qu’ils prouvent." },
    ],
  },
  {
    id: "l3", groupe: "livre", titre: "Thème et thèse du livre", comp: "Repérer",
    but: "Formuler précisément le thème et la thèse, sans confondre avec le récit ou l’hommage.",
    methode: ["Le thème n’est pas « la vie de Mohamed » : c’est la question à laquelle le livre répond.", "La thèse est une phrase qui prend position sur ce thème."],
    resolu: {
      consigne: "Pourquoi « l’amour de Mohamed pour Loubna » n’est-il pas le thème du livre ?",
      etapes: [
        { t: "1. Ce que le livre raconte", d: "L’histoire d’amour et le deuil occupent beaucoup de pages." },
        { t: "2. Ce que le livre défend", d: "Mais l’auteur dit lui-même que l’essentiel n’est pas leur histoire : c’est le message de paix." },
        { t: "3. Conclusion", d: "L’histoire d’amour a une autre fonction (hommage, émotion). Le thème argumentatif est la réponse à la haine." },
      ],
      reponse: "Thème : la réponse à apporter à la haine et à la violence terroriste.",
    },
    items: [
      { id: "l3a", niveau: 1, type: "qcm", q: "Quelle formulation est la plus juste pour le thème ?", o: ["Mohamed El Bachiri", "La réponse à apporter à la haine et à la violence terroriste", "Il faut aimer tout le monde", "Le 22 mars 2016"], a: 1, e: "C’est un sujet, sans prise de position, qui englobe tous les arguments du livre." },
      { id: "l3b", niveau: 2, type: "qcm", q: "Quelle formulation est la plus juste pour la thèse ?", o: ["L’auteur a perdu sa femme dans un attentat.", "Le jihad est un mot arabe.", "Face à la haine, il faut répondre par l’amour : un effort sur soi pour refuser la vengeance et reconnaître l’humanité de chacun.", "Molenbeek est une commune de Bruxelles."], a: 2, e: "C’est une opinion complète, qui reprend le titre (jihad de l’amour) et englobe les arguments." },
      { id: "l3c", niveau: 3, type: "redaction", max: 50, consigne: "Rédige l’introduction du résumé du livre (50 mots maximum) : source, contexte en une phrase, thème et thèse.",
        trame: [["intro", "Introduction", "Dans son essai-témoignage Un jihad de l’amour (2017), "]],
        correction: { texte: ["Modèle : « Dans son essai-témoignage Un jihad de l’amour (2017), Mohamed El Bachiri, dont l’épouse a été tuée lors de l’attentat du métro de Bruxelles en 2016, s’interroge sur la réponse à apporter à la haine terroriste. Il soutient qu’il faut lui opposer l’amour. »"], criteres: ["Titre, auteur (nom complet), date et genre.", "Contexte en une seule phrase (ou proposition).", "Thème et thèse reformulés.", "50 mots maximum, aucun avis."] } },
    ],
  },
  {
    id: "l4", groupe: "livre", titre: "Le schéma du livre à trous", comp: "Schématiser",
    but: "Compléter le schéma argumentatif du livre, de moins en moins guidé.",
    methode: ["Appuie-toi sur la leçon « L’argumentation du livre ».", "Écris court et avec tes mots."],
    resolu: {
      consigne: "Exemple : compléter l’explication de l’argument A2.",
      etapes: [
        { t: "1. L’argument", d: "Le jihad désigne d’abord un effort sur soi-même." },
        { t: "2. Ce qui le développe", d: "Le vrai jihadiste ne s’emporte pas, cherche le savoir, va vers l’autre." },
      ],
      reponse: "Explication de A2 : le vrai jihadiste maîtrise sa colère et va vers l’autre.",
    },
    items: [
      { id: "l4a", niveau: 2, type: "schema-trous", texte: "livre", trous: ["these", "arg1", "arg3", "ex0", "ex4"], consigne: "Complète la thèse, deux arguments et deux exemples." },
      { id: "l4b", niveau: 3, type: "schema-trous", texte: "livre", trous: ["theme", "these", "arg0", "arg1", "arg2", "arg3", "arg4"], consigne: "Complète le thème, la thèse et les cinq arguments." },
      { id: "l4c", niveau: 3, type: "schema-vide", texte: "livre", consigne: "Réalise seul le schéma complet du livre, puis compare avec le corrigé." },
    ],
  },
  {
    id: "l5", groupe: "livre", titre: "Évaluer des résumés du livre", comp: "Résumé → critères",
    but: "Repérer les erreurs typiques dans des résumés du livre.",
    methode: ["Situation de communication, contenu, forme : passe chaque résumé au crible de la fiche p. 86."],
    resolu: {
      consigne: "« Mohamed raconte que sa femme Loubna, prof de sport, est morte dans le métro à 9 h 10. Il était en congé. Il était très triste. »",
      etapes: [
        { t: "1. Que garde ce résumé ?", d: "Uniquement le récit : il ne contient ni thème, ni thèse, ni argument." },
        { t: "2. Énonciation", d: "Prénom seul, verbe « raconte »." },
      ],
      reponse: "Ce n’est pas un résumé de l’argumentation : c’est un résumé du récit d’ouverture.",
    },
    items: [
      { id: "l5a", niveau: 2, type: "defauts", consigne: "Résumé de Noah (200 mots max). Coche les défauts présents.",
        resume: "Dans Un jihad de l’amour, Mohamed explique qu’il a perdu sa femme et que c’est très triste. Il dit qu’il ne faut pas se venger. Il dit que le jihad c’est un effort. Il parle de Mère Teresa, de Luther, d’Averroès et de Damas. Je trouve que c’est un très beau livre qui m’a ému.",
        options: [["Prénom seul de l’auteur", true], ["Verbe « dire » répété", true], ["Liste d’exemples sans l’idée qu’ils prouvent", true], ["Avis personnel", true], ["Arguments manquants (foi et raison, diversité)", true], ["Dépassement du nombre de mots", false]],
        correction: ["Il faut écrire « El Bachiri » ou « Mohamed El Bachiri » et varier les verbes (affirme, rappelle, soutient).", "La liste « Mère Teresa, Luther, Averroès, Damas » doit être remplacée par les idées : une foi éclairée par la raison (A3) et la fraternité entre croyants (A4).", "L’argument sur la diversité et l’éducation (A5) manque.", "« Je trouve que c’est un très beau livre » est un avis : interdit dans un résumé."] },
      { id: "l5b", niveau: 3, type: "defauts", consigne: "Résumé de Lina (200 mots max). Coche les défauts présents.",
        resume: "Dans Un jihad de l’amour (2017), Mohamed El Bachiri, veuf d’une victime de l’attentat de Maelbeek, appelle les musulmans à mener le jihad contre les terroristes. Selon lui, la vengeance est donc nécessaire pour honorer les victimes. Il affirme ensuite que le Coran doit être appliqué à la lettre. Enfin, il estime que Molenbeek est dangereuse.",
        options: [["Contresens sur la thèse", true], ["Contresens sur les arguments", true], ["Source absente", false], ["Avis personnel", false], ["Énonciation à la 1re personne", false]],
        correction: ["Le résumé est bien présenté (source, 3e personne, verbes variés), mais il dit presque l’inverse du livre.", "L’auteur appelle à un jihad de l’amour, c’est-à-dire un effort sur soi contre la haine, pas à combattre les terroristes ; il rejette la vengeance.", "Il défend une lecture du Coran qui tient compte du contexte, et il défend Molenbeek contre sa caricature.", "Leçon : la fidélité passe avant la belle présentation."] },
    ],
  },
];
