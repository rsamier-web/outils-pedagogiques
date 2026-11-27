// Cours de méthode : pages courtes (segmentation), texte + visuel côte à côte (contiguïté),
// termes du glossaire signalés [[...]], une question de récupération à la fin de chaque leçon.
// Visuels : { diagram: id } ; { textroles: idTexte } ; { schema: idTexte | "livre" } ; { compare: [[mauvais, bon, commentaire], …] }

export const METHODE = [
  {
    id: "m1", titre: "Les cinq éléments d’un texte argumentatif", resume: "Thème, thèse, argument, explication, exemple : savoir les reconnaître.",
    pages: [
      {
        titre: "Le thème et la thèse",
        blocs: [
          "Un [[texte argumentatif]] cherche à faire partager une opinion. Pour l’analyser, on commence toujours par deux questions.",
          "**De quoi parle le texte ?** C’est le [[thème]] : un sujet, souvent un groupe nominal. Exemple : « le téléphone portable à l’école ».",
          "**Que pense l’auteur de ce sujet ?** C’est la [[thèse]] : une opinion, toujours une phrase complète. Exemple : « le téléphone devrait être interdit pendant les cours ».",
          "Astuce : le thème ne prend pas parti ; la thèse, si. Deux auteurs peuvent avoir le même thème et des thèses opposées.",
        ],
        visuel: { diagram: "theme-these" },
        retenir: ["Thème = de quoi parle le texte (un sujet, sans avis).", "Thèse = ce que l’auteur pense de ce sujet (une opinion, une phrase)."],
      },
      {
        titre: "Argument, explication, exemple",
        blocs: [
          "Pour défendre sa thèse, l’auteur donne des [[argument|arguments]] : des raisons. Un argument répond à la question « **pourquoi** l’auteur a-t-il raison ? ».",
          "Chaque argument est souvent développé par une [[explication]] (ou développement) : elle précise l’argument, montre comment il fonctionne.",
          "Puis vient parfois un [[exemple]] : un cas concret, précis, qui illustre l’argument. Il répond à la question « **par exemple ?** ».",
          "Regarde le texte coloré à droite : chaque couleur correspond à un rôle. Lis-le une fois en suivant les couleurs.",
        ],
        visuel: { textroles: "t1" },
        retenir: ["Argument = une raison (pourquoi ?).", "Explication = le développement de l’argument (comment ? en quoi ?).", "Exemple = un cas concret (par exemple ?)."],
      },
      {
        titre: "Les phrases qui ont une autre fonction",
        blocs: [
          "Toutes les phrases d’un texte argumentatif ne servent pas à argumenter. Certaines ont une **autre fonction** : accrocher le lecteur (une anecdote, une citation, une question), présenter le contexte, raconter, émouvoir.",
          "D’autres présentent l’avis adverse : c’est le [[contre-argument]] (ou la [[concession]], quand l’auteur admet qu’il a en partie raison : « certes… »). L’auteur y répond souvent par une [[réfutation]] (« pourtant… », « mais… »).",
          "C’est l’étape 3 de ta fiche page 78 : **repérer les parties qui ont une autre fonction que la fonction argumentative**. Elles ne vont pas dans le schéma comme des arguments.",
        ],
        visuel: { textroles: "t4" },
        retenir: ["Accroche, anecdote, contexte, citation = autre fonction.", "Contre-argument / concession = l’avis adverse ; réfutation = la réponse de l’auteur."],
      },
    ],
    check: { q: "« Les zoos modernes restent utiles s’ils protègent les espèces. » Cette phrase est…", o: ["le thème", "la thèse", "un exemple", "une explication"], a: 1, e: "C’est une opinion sur le sujet (les zoos), formulée en phrase complète : c’est la thèse. Le thème serait « l’utilité des zoos »." },
  },
  {
    id: "m2", titre: "Repérer grâce aux indices", resume: "Connecteurs, marques d’opinion, place des idées, types d’arguments.",
    pages: [
      {
        titre: "Où se cache la thèse ?",
        blocs: [
          "La thèse se trouve souvent **au début** (dans l’introduction) et elle est **reprise à la fin** (dans la conclusion). Le titre la résume parfois.",
          "Cherche les [[modalisateur|marques d’opinion]] : « selon moi », « je pense que », « il faut », « il est essentiel de », « devrait », des adjectifs comme « injuste » ou « indispensable ».",
          "Attention : la thèse n’est pas toujours la première phrase. Elle vient souvent **après une accroche** (une anecdote, une citation) ou **après une concession** (« Certes…, pourtant… »).",
        ],
        visuel: { compare: [["Chaque année, des millions de visiteurs se pressent devant les enclos des zoos.", "Accroche : ce n’est pas encore la thèse."], ["Certes, un animal en captivité ne vit pas comme dans la nature…", "Concession : l’avis adverse, admis en partie."], ["Pourtant, les zoos modernes restent utiles, à condition d’être d’abord des lieux de protection.", "La thèse arrive après « Pourtant »."]] },
        retenir: ["La thèse est souvent au début et reprise à la fin.", "Cherche les marques d’opinion et le mot qui suit une concession (pourtant, mais)."],
      },
      {
        titre: "Les connecteurs, des panneaux indicateurs",
        blocs: [
          "Les [[connecteur logique|connecteurs logiques]] indiquent le rôle de la phrase qui suit. Ce sont tes meilleurs indices.",
          "« D’abord, ensuite, de plus, enfin » annoncent souvent un **nouvel argument**. « En effet, car, c’est-à-dire » annoncent une **explication**. « Par exemple, ainsi, notamment » annoncent un **exemple**.",
          "« Certes, on objecte que, certains pensent » annoncent un **contre-argument** ; « mais, pourtant, cependant » annoncent la **réfutation** ou la thèse. « En somme, donc, bref » annoncent la **conclusion**.",
        ],
        visuel: { diagram: "connecteurs" },
        retenir: ["Les connecteurs annoncent le rôle de la phrase.", "Mais attention : « ainsi » peut annoncer un exemple ou une conséquence ; vérifie toujours le sens."],
      },
      {
        titre: "Argument ou exemple ? Le test",
        blocs: [
          "Les élèves confondent souvent argument et exemple. Voici un test simple.",
          "Un **argument** est **général** : il vaut pour beaucoup de cas et répond à « pourquoi ? ». Un **exemple** est **particulier** : il parle d’une personne, d’un lieu, d’une date, d’un chiffre précis.",
          "Essaie de mettre « Par exemple, » devant la phrase. Si cela fonctionne, c’est probablement un exemple. Essaie de mettre « parce que » devant : si cela fonctionne, c’est probablement un argument.",
          "Pour remonter d’un exemple à l’argument, demande-toi : « **qu’est-ce que cet exemple prouve ?** ». La réponse, formulée de façon générale, est l’argument.",
        ],
        visuel: { diagram: "arg-ou-ex" },
        retenir: ["Argument = général ; exemple = particulier (nom, date, lieu, chiffre).", "De l’exemple à l’argument : « Qu’est-ce que cela prouve ? »"],
      },
      {
        titre: "Les grands types d’arguments",
        blocs: [
          "Connaître les types d’arguments aide à les reconnaître plus vite.",
          "**Logique** (cause et conséquence) : « Les notifications détournent l’attention, donc les élèves apprennent moins bien. » **De valeur** (morale, justice, liberté) : « La vengeance est injuste. »",
          "**D’autorité** : on s’appuie sur un expert, un texte reconnu. **D’expérience** : on s’appuie sur un vécu. **Par l’analogie** : on compare deux situations.",
          "Dans un résumé, on ne nomme pas le type d’argument, mais savoir le reconnaître aide à **reformuler l’idée** au lieu de recopier les mots.",
        ],
        visuel: { diagram: "types-arguments" },
        retenir: ["Types fréquents : logique, de valeur, d’autorité, d’expérience, par analogie.", "Un exemple n’est pas un argument : il l’illustre."],
      },
    ],
    check: { q: "« En 2013, l’effondrement du Rana Plaza au Bangladesh a fait plus de mille morts. » Dans un texte contre la mode jetable, c’est…", o: ["la thèse", "un argument", "un exemple", "une conclusion"], a: 2, e: "C’est un cas précis (une date, un lieu, un chiffre). Il illustre l’argument général : la mode jetable repose sur l’exploitation de travailleurs." },
  },
  {
    id: "m3", titre: "La méthode du schéma (fiche p. 78)", resume: "Les six étapes pour passer du texte à sa schématisation.",
    pages: [
      {
        titre: "Les six étapes de la procédure",
        blocs: [
          "Voici la procédure de ta fiche page 78. Elle transforme un texte long en un [[schéma argumentatif]] clair.",
          "**1.** Lire le texte et le comprendre. **2.** Repérer le thème (le sujet) et la thèse (l’idée défendue). **3.** Repérer les parties qui ont une autre fonction que la fonction argumentative.",
          "**4.** Repérer les arguments et les exemples. **5.** Tracer le schéma du texte : **hiérarchiser** et **reformuler** les informations. **6.** Rédiger le résumé du texte.",
          "Ne saute pas d’étape : chaque étape réduit la quantité d’informations à garder en tête. C’est ce qui rend la tâche possible.",
        ],
        visuel: { diagram: "procedure" },
        retenir: ["Comprendre → thème et thèse → autres fonctions → arguments et exemples → schéma (hiérarchiser, reformuler) → résumé."],
      },
      {
        titre: "La structure du schéma : de A à E",
        blocs: [
          "Ton schéma se lit **de gauche à droite**, comme dans ton cours : A. le thème, B. la thèse, C. les arguments, D. les explications (le développement), E. les exemples.",
          "Chaque argument a **sa propre ligne** : on voit immédiatement combien il y en a et ce qui dépend de quoi. C’est cela, [[hiérarchiser]].",
          "Les connecteurs peuvent figurer sur les flèches : « car » entre la thèse et un argument, « en effet » vers l’explication, « par exemple » vers l’exemple.",
          "Le contre-argument et sa réfutation se placent dans une case à part, sous la thèse.",
        ],
        visuel: { schema: "t2" },
        retenir: ["A thème → B thèse → C arguments → D explications → E exemples.", "Une ligne par argument ; contre-argument dans une case à part."],
      },
      {
        titre: "Reformuler : écrire court et avec tes mots",
        blocs: [
          "Dans le schéma, on n’écrit pas de longues phrases recopiées. On [[reformuler|reformule]] : on dit la même idée, plus court, avec d’autres mots.",
          "Trois techniques : **raccourcir** (garder le noyau de la phrase), **généraliser** (remplacer une liste par un mot qui la résume : « climat, école, logement » → « leur avenir »), **nominaliser** (transformer un verbe en nom : « les élèves se concentrent moins » → « baisse de concentration »).",
          "Attention : reformuler n’est pas transformer. Le sens doit rester exactement celui de l’auteur. C’est le critère de [[fidélité]].",
        ],
        visuel: { compare: [["« Chaque notification attire l’attention, et il faut ensuite plusieurs minutes pour se remettre au travail. »", "Copié : trop long pour un schéma."], ["Les notifications détournent l’attention.", "Raccourci et reformulé : le noyau de l’idée."], ["Perte de concentration.", "Nominalisé : idéal dans une case de schéma."]] },
        retenir: ["Raccourcir, généraliser, nominaliser.", "Reformuler sans changer le sens."],
      },
    ],
    check: { q: "À quelle étape de la procédure repère-t-on une anecdote d’introduction ?", o: ["Étape 2 : thème et thèse", "Étape 3 : les parties qui ont une autre fonction", "Étape 5 : tracer le schéma", "Étape 6 : rédiger le résumé"], a: 1, e: "Une anecdote d’accroche n’argumente pas : on la repère à l’étape 3 pour ne pas la confondre avec un argument." },
  },
  {
    id: "m4", titre: "Du schéma au résumé (fiche p. 86)", resume: "Changer d’énonciateur, attribuer, hiérarchiser, rester neutre, reformuler.",
    pages: [
      {
        titre: "Changer d’énonciateur",
        blocs: [
          "Dans le texte source, l’auteur parle souvent en son nom : « je pense », « selon moi ». Dans ton résumé, **c’est toi qui écris** : tu rédiges à la **3e personne**.",
          "« Je refuse la haine » devient « El Bachiri refuse la haine » ou « l’auteur refuse la haine ».",
          "C’est ce qu’on appelle [[changer d’énonciateur]]. Tu transmets la pensée de l’auteur à un lecteur qui n’a pas lu le texte.",
        ],
        visuel: { diagram: "enonciation" },
        retenir: ["Résumé à la 3e personne : « il », « elle », « l’auteur », « El Bachiri »."],
      },
      {
        titre: "Attribuer les propos et choisir le bon verbe",
        blocs: [
          "Attribue les idées à l’auteur en utilisant son **nom de famille** (El Bachiri) ou son **prénom et son nom** (Mohamed El Bachiri). Jamais seulement le prénom.",
          "Évite de répéter « il dit que ». Choisis un [[verbe introducteur]] précis, qui montre ce que fait l’auteur : il **affirme**, **soutient**, **dénonce**, **regrette**, **reconnaît**, **réfute**, **plaide pour**, **appelle à**…",
          "Le verbe est déjà une information : « il admet que » montre une concession, « il dénonce » montre une critique.",
        ],
        visuel: { diagram: "verbes" },
        retenir: ["Nom de famille, ou prénom + nom ; jamais le prénom seul.", "Un verbe précis à la place de « dire »."],
      },
      {
        titre: "L’introduction et le développement",
        blocs: [
          "**L’introduction** donne la **source** (auteur, titre, date, éventuellement le genre), le **thème** et la **thèse**. En une ou deux phrases.",
          "**Le développement** suit l’ordre du schéma : **un paragraphe par argument** (ou un paragraphe par groupe d’arguments si la consigne est courte). Chaque paragraphe commence par l’argument et peut contenir l’explication essentielle.",
          "Organise le tout avec des **connecteurs logiques** adéquats : d’abord, ensuite, de plus, enfin ; en effet, car ; certes… mais.",
          "Les **exemples** ne sont généralement pas repris : on garde l’idée. On garde un exemple seulement s’il est indispensable pour comprendre l’argument.",
        ],
        visuel: { diagram: "schema-vers-resume" },
        retenir: ["Intro : source + thème + thèse.", "Un paragraphe par argument, dans l’ordre du schéma, avec connecteurs.", "Pas d’exemples, sauf s’ils sont indispensables."],
      },
      {
        titre: "Neutralité et reformulation",
        blocs: [
          "[[neutralité|Neutralité]] : tu transmets l’avis de l’auteur, **pas le tien**. Pas de « je trouve que », pas de « l’auteur a bien raison », pas de « malheureusement ».",
          "**Reformulation obligatoire** : tu n’as pas le droit de recopier des phrases du texte. Mais attention, **ne transforme pas** les propos de l’auteur : pas d’ajout, pas de contresens, pas d’exagération.",
          "Si un mot-clé est irremplaçable (par exemple « jihad de l’amour »), tu peux le citer entre guillemets, une fois, brièvement.",
        ],
        visuel: { compare: [["Mohamed dit qu’il ne faut pas se venger, et je trouve qu’il a tout à fait raison.", "Prénom seul, verbe « dire », avis personnel : trois erreurs."], ["El Bachiri estime que la vengeance ne fait que reproduire le mal.", "Nom de famille, verbe précis, neutralité, reformulation."]] },
        retenir: ["Pas d’avis personnel.", "Reformuler, sans transformer le sens."],
      },
      {
        titre: "Intelligibilité et recevabilité",
        blocs: [
          "[[intelligibilité|Intelligibilité]] : ton lecteur **n’a pas lu le texte** ; il doit tout comprendre sans lui. Évite les allusions (« comme dans l’exemple des colombes ») et explique les noms propres si nécessaire.",
          "Veille à être **précis**, à la correction des [[anaphore|anaphores]] (« il », « celui-ci », « cette idée » doivent renvoyer clairement à quelqu’un ou à quelque chose) et à utiliser les verbes adéquats.",
          "[[recevabilité|Recevabilité]] : respecte la consigne. Le nombre de mots maximal, le destinataire, la présentation. **Compte tes mots** et indique le total en bas de ta copie si on te le demande.",
        ],
        visuel: { diagram: "criteres" },
        retenir: ["Le lecteur doit comprendre sans le texte source.", "Respecter le nombre de mots et le destinataire."],
      },
    ],
    check: { q: "Quelle phrase respecte la fiche page 86 ?", o: ["Mohamed raconte que sa femme est morte et ça m’a beaucoup touché.", "El Bachiri affirme que la haine ne peut être combattue que par l’amour.", "Je pense qu’il faut répondre à la haine par l’amour.", "Il dit des choses sur l’amour et la haine."], a: 1, e: "Nom de famille, verbe précis (affirme), 3e personne, neutralité et idée claire : c’est la seule phrase conforme." },
  },
  {
    id: "m5", titre: "Évaluer un résumé : les critères", resume: "Pertinence, fidélité, intelligibilité, recevabilité, langue : et les erreurs fréquentes.",
    pages: [
      {
        titre: "Les critères d’un bon résumé",
        blocs: [
          "**Pertinence** : tu as gardé les informations essentielles (thèse, arguments) et supprimé l’accessoire (exemples, anecdotes, répétitions).",
          "**Fidélité** : tu respectes la pensée de l’auteur et l’ordre de ses idées, sans contresens et sans avis personnel.",
          "**Intelligibilité** : un lecteur qui ne connaît pas le texte comprend tout. **Recevabilité** : tu respectes la consigne (nombre de mots, destinataire, énonciation). **Langue** : orthographe, syntaxe, ponctuation.",
        ],
        visuel: { diagram: "criteres" },
        retenir: ["Pertinence, fidélité, intelligibilité, recevabilité, langue."],
      },
      {
        titre: "Les erreurs les plus fréquentes",
        blocs: [
          "**Recopier** des morceaux de phrases du texte. **Garder les exemples** et oublier l’argument qu’ils illustrent.",
          "**Résumer mécaniquement** paragraphe par paragraphe, en donnant autant de place à une anecdote qu’à un argument. Au contraire, la place de chaque idée dépend de son **importance**.",
          "**Trop réduire** : un texte « télégraphique », sans connecteurs, qu’on ne comprend plus. **Dépasser** le nombre de mots.",
          "**Oublier de changer d’énonciateur** (« je ») ou **donner son avis**.",
        ],
        visuel: { compare: [["Inès a acheté cinq t-shirts. Un jean demande beaucoup d’eau. Le Rana Plaza s’est effondré.", "Une suite d’exemples sans arguments ni liens : non pertinent et inintelligible."], ["Selon Delvaux, la mode jetable nuit à l’environnement, exploite les travailleurs et ne fait pas réellement économiser.", "Les arguments, reformulés et reliés."]] },
        retenir: ["Ni copie, ni exemples, ni avis.", "Proportionner selon l’importance, pas selon la longueur des paragraphes."],
      },
    ],
    check: { q: "Un résumé raconte en détail l’anecdote d’ouverture et oublie le troisième argument. Quel critère est surtout touché ?", o: ["La langue", "La pertinence", "La recevabilité", "Aucun"], a: 1, e: "Il garde l’accessoire (l’anecdote) et perd l’essentiel (un argument) : c’est un problème de pertinence." },
  },
  {
    id: "m6", titre: "Résumer un livre entier", resume: "Un essai fait de fragments : regrouper par idées, pas par chapitres.",
    pages: [
      {
        titre: "Un livre n’est pas un texte court",
        blocs: [
          "Un livre comme Un jihad de l’amour contient une cinquantaine de fragments. Impossible de faire « un paragraphe par fragment » !",
          "La méthode change d’échelle : on lit le livre par **grands mouvements**, puis on **regroupe** les fragments qui défendent la même idée. Plusieurs fragments, parfois éloignés, servent souvent un **même argument**.",
          "Par exemple, le refus de la vengeance apparaît dans « Fraternité », « Vengeance », « La peine de mort », « Les auteurs » et « Politique » : un seul argument, cinq fragments.",
        ],
        visuel: { diagram: "mouvements" },
        retenir: ["Lire par mouvements.", "Regrouper les fragments par idée : plusieurs fragments = un argument."],
      },
      {
        titre: "Trier les fragments par fonction",
        blocs: [
          "Dans un essai-témoignage, beaucoup de pages **racontent** (le jour de l’attentat, l’enfance) ou **expriment des émotions** (les poèmes à Loubna). Elles comptent énormément dans le livre, mais elles ne sont pas des arguments.",
          "Elles ont une autre fonction : **émouvoir** le lecteur ([[pathos]]) et rendre l’auteur **crédible** ([[éthos]]) : il parle en victime, en musulman pratiquant, en enfant de Molenbeek.",
          "Dans le résumé, on les évoque en **une phrase** de présentation de l’auteur. Le reste du résumé est consacré à la thèse et aux arguments.",
        ],
        visuel: { diagram: "fonctions-livre" },
        retenir: ["Récit et lyrisme = autre fonction (émouvoir, rendre crédible).", "Une phrase pour le contexte, le reste pour les arguments."],
      },
      {
        titre: "Du schéma du livre au résumé",
        blocs: [
          "Une fois le schéma du livre terminé, la rédaction suit la fiche page 86, comme pour un texte court.",
          "Pour un résumé d’environ 200 mots : une **introduction** de 40 à 50 mots (auteur, titre, date, genre, contexte en une phrase, thème et thèse), puis **un court paragraphe par argument** (25 à 35 mots chacun).",
          "Choisis un ordre logique pour les arguments, puisque le livre est fragmentaire : par exemple, du refus de la vengeance à l’éducation.",
        ],
        visuel: { schema: "livre" },
        retenir: ["Intro de 40 à 50 mots, puis un paragraphe court par argument.", "Un ordre logique, annoncé par des connecteurs."],
      },
    ],
    check: { q: "Le fragment où l’auteur raconte comment il a appris la mort de sa femme sert surtout à…", o: ["prouver que la vengeance est inutile", "émouvoir le lecteur et montrer d’où l’auteur parle", "définir le mot jihad", "réfuter un contre-argument"], a: 1, e: "C’est un récit : il a une autre fonction que l’argumentation (pathos et éthos). On l’évoque en une phrase dans le résumé." },
  },
  {
    id: "m7", titre: "Du schéma au texte argumentatif", resume: "Le chemin inverse : déplier un schéma en paragraphes rédigés.",
    pages: [
      {
        titre: "D’une ligne du schéma à un paragraphe",
        blocs: [
          "Le schéma fonctionne dans les deux sens. Tu sais passer d’un texte à son schéma ; tu peux aussi **déplier** un schéma pour écrire un texte argumentatif.",
          "Chaque ligne du schéma devient un **paragraphe** : 1. la phrase-argument, introduite par un connecteur d’énumération ; 2. une ou deux phrases d’explication (« En effet, … ») ; 3. un exemple (« Par exemple, … ») ; 4. éventuellement une phrase de lien avec la thèse.",
          "Entraîne-toi avec les trames de l’atelier : les débuts de phrases sont déjà là, tu complètes.",
        ],
        visuel: { compare: [["Argument : Le rire aide à supporter le malheur. → Explication : reprendre du pouvoir sur l’épreuve. → Exemple : les malades et les soignants.", "Une ligne de schéma."], ["Ensuite, le rire aide à supporter le malheur. En effet, rire d’une épreuve, c’est reprendre un peu de pouvoir sur elle. Par exemple, bien des malades disent que l’humour les a aidés à tenir.", "Le paragraphe rédigé."]] },
        retenir: ["Argument (connecteur) → explication (en effet) → exemple (par exemple) → lien avec la thèse."],
      },
      {
        titre: "Introduction et conclusion",
        blocs: [
          "**L’introduction** amène le thème (une accroche : un fait, une question), puis formule la thèse clairement. Elle peut annoncer les arguments.",
          "**La conclusion** reformule la thèse en résumant les arguments, puis propose une **ouverture** (une question, un conseil, un appel).",
          "Pour convaincre davantage, ajoute un **contre-argument** et sa **réfutation** avant la conclusion : tu montres que tu as pensé à l’avis adverse.",
        ],
        visuel: { diagram: "plan-texte" },
        retenir: ["Intro : accroche + thèse (+ annonce).", "Conclusion : thèse reformulée + ouverture.", "Un contre-argument réfuté renforce le texte."],
      },
    ],
    check: { q: "En dépliant un schéma, quel connecteur introduit le mieux l’explication d’un argument ?", o: ["Par exemple", "En effet", "En conclusion", "Certes"], a: 1, e: "« En effet » annonce une explication (une justification) de ce qui précède." },
  },
];
